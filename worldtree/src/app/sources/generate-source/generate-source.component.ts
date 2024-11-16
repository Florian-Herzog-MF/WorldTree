import { Component } from '@angular/core';
import { SourceService } from '../source.service';
import { WorldObjectService } from 'src/app/main/world-object.service';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ValidateSourceDialogComponent } from '../validate-source-dialog/validate-source-dialog.component';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-source',
  templateUrl: './generate-source.component.html',
  styleUrls: ['./generate-source.component.scss'],
})
export class GenerateSourceComponent {
  prompt = new FormControl('');

  isLoading = false;

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService,
    private readonly matDialog: MatDialog,
    private readonly router: Router
  ) {}

  async generate() {
    if (!this.prompt.value) {
      alert('no prompt');
      return;
    }
    this.isLoading = true;
    const amount = 10;
    const sourceText = await this.sourceService.generate(
      this.prompt.value,
      amount
    );
    const existingItems = await this.worldObjectService.search(
      sourceText,
      amount
    );
    const newItems = await this.worldObjectService.generate(
      sourceText,
      existingItems
    );

    const dialogRef = this.matDialog.open(ValidateSourceDialogComponent, {
      data: { sourceText, existingItems, newItems },
    });
    const success = await lastValueFrom(dialogRef.afterClosed());
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.isLoading = false;
    }
  }
}
