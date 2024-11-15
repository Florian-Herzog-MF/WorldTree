import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, lastValueFrom, map, switchMap } from 'rxjs';
import { SourceService } from '../source.service';
import {
  WorldObject,
  WorldObjectService,
} from 'src/app/main/world-object.service';

@Component({
  selector: 'app-new-source',
  templateUrl: './new-source.component.html',
  styleUrls: ['./new-source.component.scss'],
})
export class NewSourceComponent implements OnInit {
  content = new FormControl('');
  search = new FormControl('');

  associableItems: WorldObject[] | null = null;

  queriedItems$ = this.search.valueChanges.pipe(
    debounceTime(300),
    filter((query) => (query?.length ?? 0) > 2),
    map((query) => query ?? ''),
    switchMap((query) =>
      this.worldObjectService.getPaged({ query, skip: 0, amount: 10 })
    ),
    map((result) => result.data)
  );

  connectedItems = new FormControl<WorldObject[] | null>(null);

  canEvaluate = false;

  constructor(
    private readonly sourceService: SourceService,
    private readonly worldObjectService: WorldObjectService
  ) {}

  ngOnInit(): void {
    this.content.valueChanges.subscribe((x) => {
      this.canEvaluate = (x?.length ?? 0) > 20;
    });
  }

  async generate() {
    this.content.setValue(sampleText);
  }

  async evaluate() {
    this.canEvaluate = false;
    const items = await lastValueFrom(
      this.worldObjectService.getPaged({ skip: 0, amount: 10 })
    );
    this.associableItems = items.data;
  }

  selectedChange(selected: boolean, item: WorldObject) {
    if (selected) {
      this.associableItems = [
        item,
        ...this.associableItems!.filter((x) => x !== item),
      ];
    } else {
      this.associableItems = this.associableItems!.filter((x) => x !== item);
    }
  }

  complete() {}
}

const sampleText = `Es war einmal in einem kleinen Dorf namens Grünwald, das tief in einem dichten Wald lag. Die Bewohner lebten friedlich und waren bekannt für ihre Gastfreundschaft und ihre Liebe zur Natur. Im Zentrum des Dorfes stand das altehrwürdige Gasthaus "Zum goldenen Hirsch", das von der freundlichen Wirtin Anna geführt wurde. Das Gasthaus war ein beliebter Treffpunkt für die Dorfbewohner und Reisende gleichermaßen.
Eines Tages kam ein geheimnisvoller Fremder namens Lukas in das Dorf. Er trug einen langen, schwarzen Mantel und hatte eine alte, lederne Tasche bei sich. Lukas war auf der Suche nach einem besonderen Gegenstand, der sich angeblich in Grünwald befinden sollte: ein antikes Amulett, das magische Kräfte besaß. Dieses Amulett war einst im Besitz eines mächtigen Zauberers, der vor vielen Jahrhunderten in der Gegend lebte.
Lukas mietete ein Zimmer im Gasthaus und begann, die Dorfbewohner nach dem Amulett zu befragen. Die meisten wussten nichts darüber, aber der alte Förster Heinrich erinnerte sich an eine Legende, die er als Kind gehört hatte. Die Legende besagte, dass das Amulett in einer geheimen Kammer unter der alten Burgruine versteckt sei, die tief im Wald lag.
Am nächsten Morgen machte sich Lukas auf den Weg zur Burgruine. Er wurde von Anna begleitet, die neugierig auf das Abenteuer war, und von Heinrich, der den Weg kannte. Nach einer langen Wanderung durch den dichten Wald erreichten sie die verfallene Burg. Die Mauern waren von Efeu überwuchert, und die Türme waren eingestürzt, aber die Atmosphäre war immer noch beeindruckend.
Sie suchten nach einem Eingang zur geheimen Kammer und fanden schließlich eine versteckte Falltür unter einem Haufen Steine. Mit vereinten Kräften öffneten sie die Tür und stiegen eine steile Treppe hinab. Unten angekommen, fanden sie sich in einem dunklen, feuchten Raum wieder. In der Mitte des Raumes stand ein steinerner Altar, auf dem das Amulett lag.
Lukas nahm das Amulett vorsichtig in die Hand und spürte sofort die magische Energie, die davon ausging. Plötzlich hörten sie ein lautes Knurren und sahen, wie sich die Schatten in der Kammer bewegten. Ein riesiger, schwarzer Wolf trat aus den Schatten hervor und stellte sich ihnen in den Weg. Es war der Wächter des Amuletts, der seit Jahrhunderten über den Schatz wachte.
Heinrich, der in seiner Jugend ein erfahrener Jäger gewesen war, zog sein Jagdmesser und stellte sich dem Wolf entgegen. Nach einem kurzen, aber heftigen Kampf gelang es ihm, das Tier zu vertreiben. Erschöpft, aber erleichtert, verließen sie die Kammer und machten sich auf den Rückweg ins Dorf.
Zurück in Grünwald erzählte Lukas den Dorfbewohnern von ihrem Abenteuer und zeigte ihnen das Amulett. Er erklärte, dass er das Amulett in die Obhut des Dorfes geben wollte, damit es zum Wohl der Gemeinschaft genutzt werden konnte. Die Dorfbewohner waren begeistert und dankbar.
Von diesem Tag an war das Amulett ein Symbol für den Zusammenhalt und die Stärke der Dorfgemeinschaft. Lukas blieb in Grünwald und wurde ein geschätztes Mitglied der Gemeinschaft. Das Gasthaus "Zum goldenen Hirsch" wurde noch beliebter, und Anna erzählte jedem, der es hören wollte, die Geschichte ihres Abenteuers.
Und so lebten sie glücklich und zufrieden in ihrem kleinen Dorf im Herzen des Waldes.`;
