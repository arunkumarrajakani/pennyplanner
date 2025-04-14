import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
import { IResponse, ITransactionDetail,IChartDisplayData, IExpense } from '../interface/IResponse';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'app-expense-home',
  templateUrl: './expense-home.component.html',
  styleUrls: ['./expense-home.component.css']
})
export class ExpenseHomeComponent implements OnChanges {
  selectedRoute = "default value";


  constructor(private service:PostService,private router: Router,private formBuilder: FormBuilder) {
    console.log("called constructor");
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
  
  private userId: number;
  tableValues: ITransactionDetail[]; 
  expenseChartData: IChartDisplayData[]=[];
  incomeChartData: IChartDisplayData[] = [];
  incomeCategoryMap:Map<String,number> = new Map<String,number>();
  expenseCategoryMap:Map<String,number> = new Map<String,number>();
  expenseChart: any = {};
  incomeChart: any = {};
  myGroup: FormGroup;
  modalText:String = "";
  createTransactionGroup: FormGroup;


  changeRoute(route: string) {
    this.selectedRoute = route;
  }
  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(){
    this.ngOnInitLoad();
  }

  ngOnInitLoad() {
    console.log("called ng init");
    this.myGroup = new FormGroup({
      'trasactionDetail': this.formBuilder.control(''),
      'transactionCost': this.formBuilder.control(''),
      'transactionType': this.formBuilder.control('')
    });

    this.createTransactionGroup = new FormGroup({
      'transactionType': this.formBuilder.control(''),
      'trasactionDetail':this.formBuilder.control(''),
      'transactionCost': this.formBuilder.control(''),
      'transactionDate': this.formBuilder.control('')
    });

    
    
    this.tableValues = [];
   this.expenseChartData = [];
    this.incomeChartData= [];
    this.incomeCategoryMap= new Map<String,number>();
    this.expenseCategoryMap= new Map<String,number>();
    let totalIncome: number = 0;
    let totalExpense: number = 0;
    console.log(localStorage.getItem('user'));
    let userObject = localStorage.getItem('user');
    if(userObject != null){
      console.log("user id is" + userObject);
      this.userId = Number(userObject);
      if(this.userId != 0 || this.userId != null){
        this.service.getUserDetails<IResponse>(this.userId).subscribe(x =>{
          console.log('user details : ' + x.responseBody[0]);

          x.responseBody.forEach((element: ITransactionDetail) => {
            const transactionDetail: ITransactionDetail = element as ITransactionDetail;
            console.log('trasanction detail : ' + JSON.stringify(transactionDetail));
            this.tableValues.push(transactionDetail);
            console.log('table detail: ' + JSON.stringify(this.tableValues));

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

          this.chartOptions1.data[0].dataPoints=this.expenseChartData;
          this.chartOptions2.data[0].dataPoints=this.incomeChartData;

          this.expenseChartOptions = this.chartOptions1;
          this.incomeChartOptions = this.chartOptions2;

          this.expenseChart.render();
          this.incomeChart.render();
          //this.getExpenseChartInstance(this.expenseChart);
          //this.getExpenseChartInstance(this.incomeChart);
          }
      );
      }
    }
    
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


  chartOptions1 = {
	  animationEnabled: true,
	  title: {
		text: "Expense chart for current month"
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
    //theme: "dark2",
    colorSet: "customColorSet",
    title:{
      text: "Overall Income of the current month"
    },
    data: [{
      type: "doughnut",
      indexLabel: "{name}: {y}",
      innerRadius: "90%",
      yValueFormatString: "#,##0.00'%'",
      dataPoints: this.incomeChartData
    }]
    }
    displayStyle = "none";
    displayAlertStyle = "none";
    displayCreateModalStyle = "none";
    displayCreateAlertStye = "none";

    currentItem: ITransactionDetail;
    openPopup(item:ITransactionDetail) {
      console.log("modal opened with data: " + JSON.stringify(item));
      console.log("item value : " + item.transactionDetail);
      this.currentItem = item;
      this.myGroup.controls['trasactionDetail'].setValue(item.transactionDetail);
      this.myGroup.controls['transactionCost'].setValue(item.trasactionCost);
      this.myGroup.controls['transactionType'].setValue(item.transactionType);
      this.displayStyle = "block";
    }
    sampleId:BigInt = BigInt(-1);
    saveExpenseChanges(){
      console.log("saving changes");
      this.currentItem.transactionDetail = this.myGroup.value.trasactionDetail;
      this.currentItem.trasactionCost = this.myGroup.value.transactionCost;
      this.currentItem.transactionType = this.myGroup.value.transactionType;
      console.log("changed record : " + JSON.stringify(this.currentItem));
      this.service.updateTransactionDetail<IResponse>(this.currentItem).subscribe(x =>{
          console.log("response after update: " + JSON.stringify(x));
          let a:ITransactionDetail={
            transactionId: -1,
            transactionDate: new Date(),
            transactionType: '',
            transactionDetail: '',
            transactionCategory: '',
            trasactionCost: -1,
            transactionSource: '',
            userId: -1
          };
          this.currentItem=a;
 
          this.displayStyle = "none";
          this.modalText = x.responseMessage;
          this.displayAlertStyle = "block";
        
          
      });
    }

    deleteExpense(item: ITransactionDetail){
      this.service.deleteTransactionDetail<IResponse>(item).subscribe(x =>{
        console.log(JSON.stringify(x));
        this.modalText = x.responseMessage;
          this.displayAlertStyle = "block";
      })
    }

    closePopup() {
      this.displayStyle = "none";
    }

    reLoad(){
      console.log("inside reload");
      console.log(this.router.url);
      this.router.navigate(['/app-expense-home']);
      this.router.navigateByUrl('/app-expense-home');
    }

    closeAlertPopup(){
      this.displayAlertStyle = "none";
      this.ngOnInitLoad();
      this.reLoad();
       
    }

    create(){
      console.log("create buttin clicked");
      this.displayCreateModalStyle = "block";
    }
    createItem: ITransactionDetail;
    createTransaction(){
      console.log("save button create modal clicked");
      let a:ITransactionDetail={
        transactionId: -1,
        transactionDate: new Date(),
        transactionType: '',
        transactionDetail: '',
        transactionCategory: '',
        trasactionCost: -1,
        transactionSource : "Expense App",
        userId: this.userId
      };
      this.createItem = a;
      this.createItem.transactionDate = this.createTransactionGroup.value.transactionDate;
      this.createItem.transactionType = this.createTransactionGroup.value.transactionType;
      this.createItem.transactionDetail = this.createTransactionGroup.value.trasactionDetail;
      this.createItem.trasactionCost = this.createTransactionGroup.value.transactionCost;
    
      console.log("saving new transaction object : " + JSON.stringify(this.createItem,  (_, v) => typeof v === 'bigint' ? v.toString() : v));
      
      this.service.createTransactionDetail<IResponse>(this.createItem).subscribe(x =>{
          this.displayCreateModalStyle = "none";
          this.modalText = x.responseMessage;
          this.displayAlertStyle = "block";
          //console.log("reponse after saving : " + JSON.stringify(x,(_, v) => typeof v === 'bigint' ? v.toString() : v));
      });
    }

    closeCreatePopup(){
      this.displayCreateModalStyle = "none";
    }

    goHome(){
      this.router.navigate(['./app-expense-home']);
    }

    goDetails(){
    this.router.navigate(['./app-expense-detail']);
  }

    expenseChartOptions = this.chartOptions1;
    incomeChartOptions :any = this.chartOptions2;
  
}
