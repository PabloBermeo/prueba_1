import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, Input, SimpleChanges } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { EventBusService } from 'src/app/services/event-bus.service';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { environment } from 'src/environments/environment';
const URL=environment.url;
//https://valor-software.com/ng2-charts/line
@Component({
  selector: 'app-numberchart',
  templateUrl: './numberchart.component.html',
  styles: [
  ]
})
export class NumberchartComponent {
  @Input() config:any;
  @Input() demo:boolean=true;

  value:number=0.0;
  sending=false;
  receivedTime=0;
  time:number=0;
  nowTime:number=0;
  isMounted:boolean=true;
  topic_ini="";
  

  public lineChartData:Array<any>=[{data:[]}];
  public lineChartOptions:any;
  public lineChartLabels:Array<any>=[];
  legend=false;
  public lineChartType:any;
  public canvas:any;
  public ctx:any;
  public chartColor:any;
  public gradientFill:any;
  public gradientStroke:any;


  constructor(private _eventBus:EventBusService,
            private _http:HttpClient,
            private _peticionesHttp:PeticionesHttpService,
            private _uiService:UiServiceService
  ){
    this.time=Date.now();
    this.nowTime=Date.now();
    this.isMounted=false;
    this.lineChartData[0].data=[];
    
  }
  getNow(){
    this.nowTime=Date.now();
    setTimeout(()=>{
      this.getNow();
    },1000);
  }
  fechaActual(){
    this.nowTime=Date.now();
  }
  //funciones para html
  getTimeAgo(seconds:number){
    if(seconds<0){
      seconds=0;
    }
    if(seconds<=59){
      return seconds.toFixed()+" secs.";
    }
    if(seconds>59 && seconds<3600){
      seconds=seconds /60;
      return seconds.toFixed() + " min.";
    }
    if(seconds>=3600 && seconds<86400){
      seconds=seconds/3600;
      return seconds.toFixed()+ " hour.";
    }
    if(seconds>=86400){
      seconds=seconds/86400;
      return seconds.toFixed()+ " day.";
    }
    return " x seg.";
  }
  getIconColor(){
    return this._eventBus.getIconColor(!this.value,this.config);
  }
   async iniciarValores(){
    this.chartColor="#FFFFFF";
  
    
    this.lineChartData=[
      {
          label: "Active Users",
          pointBorderWidth:2,
          pointHoverRadius:7,
          pointHoverBorderWidth:2,
          pointRadius:5,
          fill:true,
          borderWidth:2,

          //data:[542, 480, 430,550,453,700,380,434,568,610,500, 630],
          data:[
            {x:1715170567029,y:20},
            {x:1715170577029,y:40},
            {x:1715170587029,y:10},
            {x:1715170597029,y:30}
          ],

          backgroundColor: this.gradientFill,
          borderColor: '#f96332',
          pointBorderColor: "#f96332",
          pointBackgroundColor:'#FFF',
          pointHoverBackgroundColor:'#FFFFFF',
          pointHoverBorderColor: '#000000'

      }
    ];

   // this.lineChartLabels=["Jan","Feb","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   this.lineChartLabels=[];
   this.actualizarLabels();
   
    this.lineChartOptions={
      responsive:true,
      elements:{
        line:{tension:0.4}
      },
      layout:{
        padding:{
          left:0,
          right:0,
          top:15,
          bottom:15
        }
      },
      maintainAspectRatio:false,
      tooltips:{
        backgroundColor:'#ff0000',
        titleFontColor:'#333',
        bodyFontColor:'#666',

        bodySpacing:4,
        xPadding:10,
        mode:"nearest",
        intersect:0,
        position:"nearest",

      },
      scales:{
        
        y:{
          display:true,
          
          ticks:{
            display:true,
            fontColor:"rgba(255,0,0,0.4)",
            fontStyle:"bold",
            maxTicksLimit:5,
            padding:10
          },
          gridLines:{
            drawTicks:false,
            drawBorder:false,
            display:false,
            color:"rgba(255,0,0,0.8)"
          },
          labels:{
            style:{
              color:"rgba(255,0,0,1)",//"#d4d2d2",
              font: '11px Trebuchet MS, Verdana, sans-serif'
            }
          }
        },
        x:{

        }
      },
    };
    this.lineChartType='line';
    this.canvas=document.getElementById("lineChartV1");
    if(this.canvas===null){
      return;
    }
    this.ctx=await this.canvas.getContext("2d");
    console.log("estamos iniciando valores, ctx:",this.ctx);

    this.gradientStroke=this.ctx.createLinearGradient(500,0, 100,0);
    this.gradientStroke.addColorStop(0, '#80b6f4');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill=this.ctx.createLinearGradient(0,0,0,300);
    this.gradientFill.addColorStop(0,"rgba(128,182,244,0)");
    this.gradientFill.addColorStop(1,"rgba(249,99,59,0.60)");
   }
 actualizarLabels(){
  this.lineChartLabels=[];
  this.lineChartData[0].data.map(item=>{
    const date=new Date(item.x);
    const mes=date.toLocaleString('default',{month:'short'});
    const dia=date.getDate();
    const hh=date.getHours();
    const mm=date.getMinutes();
    const ss=date.getSeconds();
    this.lineChartLabels.push(`${dia}-${mes}-${hh}:${mm}:${ss}`);

   });
 }
   processReceiveData(data0:any){
    this.time=Date.now();
    const data=JSON.parse(data0);
    //this.value=data.value;
    if(!this.config.demo){
      this.time=Date.now();
      this.value=data.value;
      console.log('------------------------------en processReceiveData-------------------------------');
      //console.log('data:',data);
      //console.log('data.save:',data.save);
      //console.log('data.value:',data.value);
      setTimeout(()=>{
        if(data.save===1){
          this.getChartData();
        }
      },1000);
    }
   }

   ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.config.demo=this.demo;
   }
   async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    await this.iniciarValores();
    this.topic_ini=this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/sdata";
    this._eventBus.on(this.topic_ini).subscribe(data=>{
      this.processReceiveData(data);
    });
    setTimeout(()=>{
      this.lineChartData[0].name=`${this.config.variableFullName} ${this.config.unit}`;
      this.updateColorClass();
      window.dispatchEvent(new Event('resize'));
    },1000);
    
   }
  
   ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes['config']){
      //desconectarme del topic
      this._eventBus.off(this.topic_ini);
      //actualizar topic y subscribirme/conectarme al nuevo topic
      this.topic_ini=this.config.userId+"/"+this.config.selectedDevice.dId+"/"+this.config.variable+"/sdata";
      this._eventBus.on(this.topic_ini).subscribe(data=>{
        this.processReceiveData(data);
      });
      setTimeout(()=>{
        this.lineChartData[0].name=`${this.config.variableFullName} ${this.config.unit}`;
        this.updateColorClass();
        this.getNow();
        window.dispatchEvent(new Event('resize'));
      },1000);
    }
   }
   ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._eventBus.off(this.topic_ini);
   }
   updateColorClass(){
   // console.log('update:'+this.config.class);
    var c=this.config.class;
    if(c==="success"){
      this.lineChartData[0].color="#00f2c3";
    }
    if(c==="primary"){
      this.lineChartData[0].color="#e14eca";
    }
    if(c==="warning"){
      this.lineChartData[0].color="#ff8d72";
    }
    if(c==="danger"){
      this.lineChartData[0].color="#fd5d93";
    }
    this.lineChartData[0].name=this.config.variableFullName+" "+this.config.unit;
   }
   getChartData(){
    this.isMounted=false;
    //this.config.demo=true;
    if(this.config.demo){
      this.lineChartData[0].data.unshift(
             
          {x:1715170607029,y:55},
          {x:1715170617029,y:35},
          {x:1715170627029,y:45},
          {x:1715170637029,y:25}
      );
      console.log('data:',this.lineChartData[0].data);
      this.actualizarLabels();
      console.log('labels:',this.lineChartLabels);
      this.isMounted=true;
      this.config.demo=false;
      this.value=25.7;
     
      return;
    }

    if(this.config.selectedDevice.dId=== undefined){
      console.error('En getChartData el dId es undefined');
      this._uiService.toastWarning('No one device selected, dId is undefined');
      return;
    }
    const header=new HttpHeaders({'x-token': this._peticionesHttp.x_token()});
    const http_headers={
      headers:header,
      params:{
        dId:this.config.selectedDevice.dId,
        variable:this.config.variable,
        chartTimeAgo: this.config.chartTimeAgo,
            
      }
    }
    try {
      this._http.get(`${URL}/api/chart-data`,http_headers)
                  .subscribe(resp1=>{
                    console.log('resp1:',resp1);
                    if(!resp1['ok']){
                      console.error('ERROR EN LECTURA DE DATOS DE BD');
                      this._uiService.toastWarning('ERROR IN READING DATA FROM DB');
                      return;  
                    }
                    if(resp1['data'].length===0){
                      console.log('NO hay datos nuevos');
                      return;
                    }else{
                      this.lineChartData[0].data=[];
                    }
                    var data=resp1['data'];
                    data.forEach(dato=>{
                      var tiempo:any=dato.time;
                      var valor:number=dato.value;
                      this.lineChartData[0].data.push({x:tiempo,y:valor});
                    })
                    this.actualizarLabels();
                    this.isMounted=true;
                    return;
                  })
    } catch (error) {
      console.error('ERROR en lectura de datos:',error);
      return;
    }
    
   }

   public chartClicked(e:any){
    //console.log('Click:',e)
   }
   public chartHovered(e:any){
    //console.log('Hover:',e)
   }
}
