import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import {
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  timer,
} from 'rxjs';
import { I18nCallback } from '../i18n/i18n.service';

export abstract class AutocompleteOption<T> {
  abstract label: I18nCallback;

  constructor(public readonly value: T, public readonly disabled: boolean) {}
}

export class AutocompleteHint extends AutocompleteOption<any> {
  constructor(public override readonly label: I18nCallback) {
    super(null, true);
  }
}

interface InternalState<T> {
  inputElement: HTMLInputElement;
  input: string | null;
  inputOverride: string | null | undefined;
  value: T | null;
  readonly: boolean;
  disabled: boolean;
  required: boolean;
  placeholder: string;
  touched: boolean;
  focused: boolean;
}

@Component({ template: '' })
export abstract class CustomAutocompleteBaseComponent<T>
  implements
    ControlValueAccessor,
    MatFormFieldControl<T | null>,
    OnInit,
    DoCheck,
    OnDestroy
{
  static nextId = 0;
  @HostBinding() readonly id: string;
  readonly controlType: string;

  public readonly ngControl = inject(NgControl);
  private readonly focusMonitor = inject(FocusMonitor);
  private readonly elementRef = inject(ElementRef);

  // do not push updates directly. use update() instead.
  private state$ = new BehaviorSubject<InternalState<T>>({
    inputElement: null!,
    input: null,
    inputOverride: undefined,
    value: this.ngControl?.value ?? null,
    readonly: false,
    disabled: false,
    required: false,
    placeholder: '',
    touched: false,
    focused: false,
  });
  private get state() {
    return this.state$.value;
  }

  public readonly stateChanges = this.state$.pipe(map(() => void 0));

  get required(): boolean {
    return this.state.required;
  }
  @Input() set required(value: BooleanInput) {
    this.update({ required: value !== false });
  }

  get readonly(): boolean {
    return this.state.readonly;
  }
  @Input() set readonly(value: BooleanInput) {
    this.update({ readonly: value !== false });
  }

  get disabled(): boolean {
    return this.state.disabled && !this.state.readonly;
  }
  @Input() set disabled(value: boolean) {
    this.update({ disabled: !!value });
  }

  get value(): T | null {
    return this.state.value;
  }
  @Input() set value(value: T | null) {
    this.update({ value });
  }

  public get placeholder() {
    return this.state.placeholder;
  }
  public set placeholder(value) {
    this.update({ placeholder: value });
  }

  get touched(): boolean {
    return this.state.touched;
  }

  get focused() {
    return this.state.focused;
  }

  get inputElement() {
    return this.state.inputElement;
  }

  get input() {
    return this.state.input;
  }

  private get inputOverride() {
    return this.state.inputOverride;
  }

  public empty = true;
  public errorState = false;

  @HostBinding('class.custom-autocomplete') public isCustomAutocomplete = true;
  @HostBinding('class.float-label') public shouldLabelFloat = true;

  private readonly changeListeners: ((value: T | null) => void)[] = [];
  private readonly touchListeners: (() => void)[] = [];
  private readonly eventListeners: {
    observedElement?: HTMLElement;
    type: string;
    handler: any;
  }[] = [
    { type: 'input', handler: (event: Event) => this.handleInput(event) },
    { type: 'focusin', handler: () => this.handleFocusIn() },
    { type: 'focusout', handler: () => this.handleFocusOut() },
    { type: 'blur', handler: () => this.handleBlur() },
  ];

  protected readonly input$ = this.state$.pipe(
    map((state) => state.input),
    distinctUntilChanged()
  );

  protected readonly value$ = this.state$.pipe(
    map((state) => state.value),
    distinctUntilChanged()
  );

  constructor() {
    const controlType = this.getControlType();
    this.controlType = controlType;
    this.id = `${controlType}-${CustomAutocompleteBaseComponent.nextId++}`;
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.state$
      .pipe(
        map((state) => state.value),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.ngControl?.control?.markAsDirty();
        this.changeListeners.forEach((fn) => fn(value));
      });

    this.state$
      .pipe(
        map((state) => state.touched),
        filter((touched) => touched),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.ngControl?.control?.markAsTouched();
        this.touchListeners.forEach((fn) => fn());
      });
  }

  ngDoCheck() {
    const inputElement = this.queryInputElement();
    this.update({ inputElement });

    this.empty = !inputElement?.value;
    this.shouldLabelFloat = this.focused || !this.empty;

    this.errorState = this.ngControl?.invalid ?? false;

    this.eventListeners.forEach(({ observedElement, type, handler }) => {
      if (observedElement !== inputElement) {
        observedElement?.removeEventListener(type, handler);
        inputElement?.addEventListener(type, handler);
      }
    });
  }

  ngOnDestroy() {
    this.eventListeners.forEach(({ observedElement, type, handler }) => {
      observedElement?.removeEventListener(type, handler);
    });
  }

  private update(stateChanges: Partial<InternalState<T>>) {
    if (stateChanges.inputOverride !== undefined) {
      stateChanges.input = stateChanges.inputOverride;
    }
    const currentState = this.state as any;
    const effective = Object.entries(stateChanges).reduce(
      (acc, [key, value]) => acc || currentState[key] !== value,
      false
    );
    if (!effective) {
      return;
    }
    this.state$.next({ ...currentState, ...stateChanges });

    firstValueFrom(timer(1)).then(() => {
      const inputElement = this.queryInputElement();
      if (inputElement != null) {
        if (this.readonly) {
          inputElement.value = this.input ?? '-';
        } else {
          inputElement.value = this.input ?? '';
        }
      }
    });
  }

  private queryInputElement(): HTMLInputElement {
    return this.elementRef.nativeElement.querySelector('input');
  }

  // MatFormFieldControl implementation
  setDescribedByIds(ids: string[]) {
    this.elementRef.nativeElement.setAttribute(
      'aria-describedby',
      ids.join(' ')
    );
  }

  // MatFormFieldControl implementation
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.focusMonitor.focusVia(this.inputElement, 'program');
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: T | null): void {
    this.format(value).then((formatted) => {
      // override user input with formatted value.
      // This might irritate the user if the value is force-changed at an unexpected time, but that is unlikely.
      this.update({ value, inputOverride: formatted });
    });
  }

  // ControlValueAccessor implementation
  registerOnChange(fn: (value: T | null) => void): void {
    this.changeListeners.push(fn);
  }

  // ControlValueAccessor implementation
  registerOnTouched(fn: () => void): void {
    this.touchListeners.push(fn);
    if (this.touched) {
      fn();
    }
  }

  // ControlValueAccessor implementation
  setDisabledState?(isDisabled: boolean): void {
    this.update({ disabled: isDisabled });
  }

  handleInput(event: Event): void {
    this.update({
      input: (event.target as HTMLInputElement).value,
      inputOverride: undefined,
    });
  }

  handleFocusIn(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    this.update({ focused: true });
  }

  handleFocusOut(): void {
    this.update({ focused: false });
  }

  async handleBlur() {
    // if the input is overridden, the user has not interacted with the input element.
    if (this.inputOverride !== undefined) {
      return;
    }
    const value = await this.parse(this.input);
    const formatted = await this.format(value);
    // override user input with formatted value. Unlikely to irritate the user as this happens on blur.
    this.update({
      touched: true,
      focused: false,
      value,
      inputOverride: formatted,
    });
  }

  protected abstract getControlType(): string;

  protected abstract format(value: T | null): Promise<string | null>;

  protected abstract parse(value: string | null): Promise<T | null> | T | null;
}
