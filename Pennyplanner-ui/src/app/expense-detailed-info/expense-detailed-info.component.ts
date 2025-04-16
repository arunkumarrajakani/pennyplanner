import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Food, IChartDisplayData, IResponse, ITransactionDetail } from '../interface/IResponse';
import { PostService } from '../services/post.service';


@Component({
  selector: 'app-expense-detailed-info',
  templateUrl: './expense-detailed-info.component.html',
  styleUrls: ['./expense-detailed-info.component.css']
})
export class ExpenseDetailedInfoComponent {

  constructor(private router: Router,private service:PostService){}

  selectedMonth: String = "11";
  monthMap : Map<String,String> = new Map<String,String>([
    ["1","January"],["2","February"],["3","March"],["4","April"],["5","May"],["6","June"],
    ["7","July"],["8","August"],["9","September"],["10","October"],["11","November"],["12","December"]
  ]);

  private userId: number;
  expenseChartData: IChartDisplayData[]=[];
  incomeChartData: IChartDisplayData[] = [];
  yearlyExpenseChartData: IChartDisplayData[]=[];
  yearlyIncomeChartData: IChartDisplayData[] = [];
  incomeCategoryMap:Map<String,number> = new Map<String,number>();
  expenseCategoryMap:Map<String,number> = new Map<String,number>();
  yearlyIncomeCategoryMap:Map<String,number> = new Map<String,number>();
  yearlyExpenseCategoryMap:Map<String,number> = new Map<String,number>();
  expenseChart: any = {};
  incomeChart: any = {};
  yearlyExpenseChart: any = {};
  yearlyIncomeChart: any = {};

  ngOnInit() {
    console.log("called ng init");
    
   this.expenseChartData = [];
    this.incomeChartData= [];
    this.yearlyExpenseChartData = [];
    this.yearlyIncomeChartData = [];
    this.incomeCategoryMap= new Map<String,number>();
    this.expenseCategoryMap= new Map<String,number>();
    this.yearlyIncomeCategoryMap = new Map<String,number>();
    this.yearlyExpenseCategoryMap = new Map<String,number>();
    let totalIncome: number = 0;
    let totalExpense: number = 0;
    console.log(localStorage.getItem('user'));
    let userObject = localStorage.getItem('user');
    if(userObject != null){
      console.log("user id is" + userObject);
      this.userId = Number(userObject);
      if(this.userId != 0 || this.userId != null){
        this.service.getAllTransactionDetails<IResponse>(this.userId).subscribe(x =>{
          console.log('user details : ' + x.responseBody[0]);

          x.responseBody.forEach((element: ITransactionDetail) => {
            const transactionDetail: ITransactionDetail = element as ITransactionDetail;
            console.log('trasanction detail : ' + JSON.stringify(transactionDetail));


            if(element.transactionType == 'EXPENSE'){
              totalExpense+= element.trasactionCost;
              let existingVal = this.yearlyExpenseCategoryMap.get(element.transactionDetail);
              if(this.yearlyExpenseCategoryMap.has(element.transactionDetail) && existingVal != undefined){
                  this.yearlyExpenseCategoryMap.set(element.transactionDetail,existingVal+element.trasactionCost);
              }else{
                this.yearlyExpenseCategoryMap.set(element.transactionDetail,element.trasactionCost);
              }
            }
            if(element.transactionType == 'INCOME'){
              totalIncome+= element.trasactionCost;
              let existingVal = this.yearlyIncomeCategoryMap.get(element.transactionDetail);
              if(this.yearlyIncomeCategoryMap.has(element.transactionDetail) && existingVal != undefined){
                  this.yearlyIncomeCategoryMap.set(element.transactionDetail,existingVal+element.trasactionCost);
              }else{
                this.yearlyIncomeCategoryMap.set(element.transactionDetail,element.trasactionCost);
              }
            }
          });
        
          console.log('expense map log: ' +  [...this.yearlyExpenseCategoryMap.entries()]);
          console.log('income map log: ' + [...this.yearlyIncomeCategoryMap.entries()]);

          for(let entry of this.yearlyExpenseCategoryMap.entries()){
            let percentage:number = Number(((entry[1]/totalExpense)*100).toFixed(2));
            
            const chartOption: IChartDisplayData = {
              y: percentage,
              name: entry[0]
            }
            
            this.yearlyExpenseChartData.push(chartOption);
          }
    
          for(let entry of this.yearlyIncomeCategoryMap.entries()){
            let percentage:number = Number(((entry[1]/totalIncome)*100).toFixed(2));
            const chartOption: IChartDisplayData = {
              y: percentage,
              name: entry[0]
            }
            
            this.yearlyIncomeChartData.push(chartOption);
          }
    
          console.log('expense chart data: ' +  JSON.stringify(this.expenseChartData));
          console.log('income chart data: ' + JSON.stringify(this.incomeChartData));

          this.chartOptions1.data[0].dataPoints=this.yearlyExpenseChartData;
          this.chartOptions2.data[0].dataPoints=this.yearlyIncomeChartData;


          this.yearlyExpenseChartOptions = this.chartOptions1;
          this.yearlyIncomeChartOptions = this.chartOptions2;


          this.yearlyExpenseChart.render();
          this.yearlyIncomeChart.render();
          //this.getExpenseChartInstance(this.expenseChart);
          //this.getExpenseChartInstance(this.incomeChart);
          }
      );
          this.loadMonthlyData(this.selectedMonth);
      }
    }
    
  }

  loadMonthlyData(monthId : String){

    this.expenseChartData = [];
    this.incomeChartData= [];
    this.yearlyExpenseChartData = [];
    this.yearlyIncomeChartData = [];
    this.incomeCategoryMap= new Map<String,number>();
    this.expenseCategoryMap= new Map<String,number>();
    this.yearlyIncomeCategoryMap = new Map<String,number>();
    this.yearlyExpenseCategoryMap = new Map<String,number>();
    let totalIncome: number = 0;
    let totalExpense: number = 0;
    console.log(localStorage.getItem('user'));
    let userObject = localStorage.getItem('user');
    if(userObject != null){
      console.log("user id is" + userObject);
      this.userId = Number(userObject);
      if(this.userId != 0 || this.userId != null){
        this.service.getTransactionDetailsByMonth<IResponse>(this.userId,monthId).subscribe(x =>{
          console.log('user details : ' + x.responseBody[0]);

          x.responseBody.forEach((element: ITransactionDetail) => {
            const transactionDetail: ITransactionDetail = element as ITransactionDetail;
            console.log('trasanction detail : ' + JSON.stringify(transactionDetail));


            if(element.transactionType == 'EXPENSE'){
              totalExpense+= element.trasactionCost;
              let existingVal = this.expenseCategoryMap.get(element.transactionDetail);
              if(this.expenseCategoryMap.has(element.transactionDetail) && existingVal != undefined){
                  this.expenseCategoryMap.set(element.transactionDetail,existingVal+element.trasactionCost);
              }else{
                this.expenseCategoryMap.set(element.transactionDetail,element.trasactionCost);
              }
            }
            if(element.transactionType == 'INCOME'){
              totalIncome+= element.trasactionCost;
              let existingVal = this.incomeCategoryMap.get(element.transactionDetail);
              if(this.incomeCategoryMap.has(element.transactionDetail) && existingVal != undefined){
                  this.incomeCategoryMap.set(element.transactionDetail,existingVal+element.trasactionCost);
              }else{
                this.incomeCategoryMap.set(element.transactionDetail,element.trasactionCost);
              }
            }
          });
        
          console.log('expense map log: ' +  [...this.expenseCategoryMap.entries()]);
          console.log('income map log: ' + [...this.incomeCategoryMap.entries()]);

          for(let entry of this.expenseCategoryMap.entries()){
            let percentage:number = Number(((entry[1]/totalExpense)*100).toFixed(2));
            
            const chartOption: IChartDisplayData = {
              y: percentage,
              name: entry[0]
            }
            this.expenseChartData.push(chartOption);
          }
    
          for(let entry of this.incomeCategoryMap.entries()){
            let percentage:number = Number(((entry[1]/totalIncome)*100).toFixed(2));
            const chartOption: IChartDisplayData = {
              y: percentage,
              name: entry[0]
            }
            this.incomeChartData.push(chartOption);
          }
    
          console.log('expense chart data: ' +  JSON.stringify(this.expenseChartData));
          console.log('income chart data: ' + JSON.stringify(this.incomeChartData));

          this.chartOptions3.data[0].dataPoints=this.expenseChartData;
          this.chartOptions4.data[0].dataPoints=this.incomeChartData;
          this.chartOptions3.title.text = "Expense chart for "+this.monthMap.get(monthId);
          this.chartOptions4.title.text = "Overall Income for "+this.monthMap.get(monthId);

          this.expenseChartOptions = this.chartOptions3;
          this.incomeChartOptions = this.chartOptions4;

          this.expenseChart.render();
          this.incomeChart.render();
          //this.getExpenseChartInstance(this.expenseChart);
          //this.getExpenseChartInstance(this.incomeChart);
          }
      );
      }
    }
  }

  goHome(){
    this.router.navigate(['./app-expense-home']);
  }

  goDetails(){
    this.router.navigate(['./app-expense-detail']);
  }

  changeMethod(){
    console.log("ng model changed. current month : "+ this.selectedMonth);
    this.loadMonthlyData(this.selectedMonth);
  }
  chartOptions1 = {
	  animationEnabled: true,
	  title: {
		text: "Expense chart for current year"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{name}: {y}",
		yValueFormatString: "#,###.##'%'",
		dataPoints:this.expenseChartData
	  }]
	}

  chartOptions2 = { 
    animationEnabled: true,
    
    colorSet: "customColorSet",
    title:{
      text: "Overall Income for current year"
    },
    data: [{
      type: "doughnut",
      indexLabel: "{name}: {y}",
      innerRadius: "90%",
      yValueFormatString: "#,##0.00'%'",
      dataPoints: this.incomeChartData
    }]
    }

    chartOptions3 = {
      animationEnabled: true,
      title: {
      text: "Expense chart for "+this.monthMap.get(this.selectedMonth)
      },
      data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{name}: {y}",
      yValueFormatString: "#,###.##'%'",
      dataPoints:this.expenseChartData
      }]
    }
  
    chartOptions4 = { 
      animationEnabled: true,
      
      colorSet: "customColorSet",
      title:{
        text: "Overall Income for "+this.monthMap.get(this.selectedMonth)
      },
      data: [{
        type: "doughnut",
        indexLabel: "{name}: {y}",
        innerRadius: "90%",
        yValueFormatString: "#,##0.00'%'",
        dataPoints: this.incomeChartData
      }]
      }

    getExpenseChartInstance(chart: object){
      console.log("inside get chart");
      
      this.expenseChart = chart;
      this.expenseChart.render();
    }
  
    getIncomeChartInstance(chart: object){
      this.incomeChart = chart;
      this.incomeChart.render();
    }

    getExpenseChartYearlyInstance(chart: object){
      console.log("inside get chart");
      
      this.yearlyExpenseChart = chart;
      this.yearlyExpenseChart.render();
    }
  
    getIncomeChartYearlyInstance(chart: object){
      this.yearlyIncomeChart = chart;
      this.yearlyIncomeChart.render();
    }

  expenseChartOptions = this.chartOptions3;
    incomeChartOptions :any = this.chartOptions4;
    yearlyExpenseChartOptions = this.chartOptions1;
    yearlyIncomeChartOptions = this.chartOptions2;
}
