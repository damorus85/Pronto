import { NgModule } from '@angular/core';
import { PriceFormatPipe } from './price-format/price-format';
import { AllergiesFormatPipe } from './allergies-format/allergies-format';
@NgModule({
	declarations: [PriceFormatPipe,
    AllergiesFormatPipe],
	imports: [],
	exports: [PriceFormatPipe,
    AllergiesFormatPipe]
})
export class PipesModule {}
