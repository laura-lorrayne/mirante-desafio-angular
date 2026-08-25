import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [ButtonModule],
  template: `
    <div style="padding: 2rem">
      <h1>Mirante Tecnologia</h1>

      <p-button label="PrimeNG funcionando" icon="pi pi-check" />
    </div>
  `,
})
export class App {}
