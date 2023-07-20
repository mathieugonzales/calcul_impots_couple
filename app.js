new Vue({
    el: '#app',
    data: {
      salary1: 0,
      salary2: 0,
      taxesUser1: 0,
      taxesUser2: 0,
      taxesDifference: 0,
      user1Taxes: [],
      user2Taxes: [],
      totalTaxesWithPacs: 0,
      totalTaxesWithoutPacs: 0,
      familyParts: 2,
    },
    methods: {
      calculateTaxes() {
        // Calcul des impôts individuels et communs par tranche
        this.user1Taxes = this.calculateTaxesForIncome(parseFloat(this.salary1));
        this.user2Taxes = this.calculateTaxesForIncome(parseFloat(this.salary2));
        const totalTaxableIncome = (parseFloat(this.salary1) + parseFloat(this.salary2)) / this.familyParts;
        const totalTaxesWithPacs = this.calculateTaxesForIncome(totalTaxableIncome);
  
        // Calcul des impôts totaux
        this.taxesUser1 = this.user1Taxes.reduce((total, tax) => total + tax.impot, 0);
        this.taxesUser2 = this.user2Taxes.reduce((total, tax) => total + tax.impot, 0);
        this.totalTaxesWithPacs = totalTaxesWithPacs.reduce((total, tax) => total + tax.impot, 0) * this.familyParts;
        this.totalTaxesWithoutPacs = this.taxesUser1 + this.taxesUser2;
        
        this.taxesDifference = this.totalTaxesWithoutPacs - this.totalTaxesWithPacs;
      },
      calculateTaxesForIncome(income) {
        const tranches = [
          { min: 0, max: 10777, taux: 0 },
          { min: 10777, max: 27478, taux: 0.11 },
          { min: 27478, max: 78570, taux: 0.30 },
          { min: 78570, max: 168994, taux: 0.41 },
          { min: 168994, max: Infinity, taux: 0.45 }
        ];
  
        let restIncome = income;
        const taxes = [];
  
        for (const tranche of tranches) {
          if (restIncome <= 0) break;
  
          const taxableIncome = Math.min(restIncome, tranche.max - tranche.min); 
          const impot = taxableIncome * tranche.taux;
  
          taxes.push({ tranche: `${tranche.min} - ${tranche.max}`, impot });
  
          restIncome -= taxableIncome;
        }
  
        return taxes;
      }
    },
  });
