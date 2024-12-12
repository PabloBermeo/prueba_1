import { Component } from '@angular/core';
import { EventBusService } from 'src/app/services/event-bus.service';
import { MngWidgetsService } from 'src/app/services/mng-widgets.service';
import { PeticionesHttpService } from 'src/app/services/peticiones-http.service';
import { UiServiceService } from 'src/app/services/ui-service.service';
import { IConfigW,ITemplates } from 'src/app/services/clases.models';
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styles: [
  ]
})
export class TemplatesComponent {
  opciones=[
    {id:'numberChart',msn:'Number Chart INPUT <-'},
    {id:'indicator',msn:'Boolean Indicator INPUT <-'},
    {id:'map',msn:'Map INPUT<-'},
    {id:'switch',msn:'Switch OUTPUT ->'},
    {id:'button',msn:'Button OUTPUT ->'},
  ];
  opcionSeleccionada='';
  configIni:IConfigW={
    userId:'',
    selectedDevice:{
      name:'',
      dId:''
    },
    variableFullName:'',
    variable:'',
    variableType:'',//puede ser input o "output"
    icon:'',
    class:'success',
    column:''
  }
  configRx:IConfigW={
    userId:'',
    selectedDevice:{
      name:'',
      dId:''
    },
    variableFullName:'',
    variable:'',
    variableType:'',//puede ser input o "output"
    icon:'',
    class:'success',
    column:''
  }
  widgets:IConfigW[]=[];
  habilitarAddWidget=false;
  templates:ITemplates[]=[];
  template:ITemplates={
    userId:'',
    name:''
  }


  constructor(//private _eventBus:EventBusService,
              private _mngWidgets:MngWidgetsService,
              private _peticionesHttp:PeticionesHttpService,
              private _uiService:UiServiceService){
                this.widgets=[];
                this.widgets=this._mngWidgets.readWidgets();
              }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._peticionesHttp.getTemplates().then(results=>{
      this.templates=results
    }).catch(err=>{
      this.templates=[];
    })
  }
   actualizarConfig(event:IConfigW){
      this.configRx=event;
      this.habilitarAddWidget=true;
      console.log('en templates:',this.configRx);
    }
    addNewWidget(){
      this.configRx.widget=this.opcionSeleccionada;
      this.configRx.variable=this._mngWidgets.makeId(10);
      //this.widgets.push(this.configRx);
      this._mngWidgets.addNewWidget(this.configRx);
    }
    delWidget(pos:number){
      this._mngWidgets.delWidget(pos);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveTemplate(){
      this.template.widgets=this.widgets;
      //this.templates.push(JSON.parse(JSON.stringify(this.template)) );
      this._peticionesHttp.saveTemplate(this.template)
                .then(resp=>{
                  if(resp){
                    console.log('Grabación de Template-ok')
                  }else{
                    this._uiService.alertaError('No se puede grabar Template:'+this.template.name);
                  }
                }).catch(err=>{
                  this._uiService.alertaError('Error desconocido, No se puede grabar Template');
                })
    }
    deleteTemplate(i:number){
     // this.templates.splice(i,1);
     this._peticionesHttp.deleteTemplate(this.templates[i])
                  .then(resp=>{
                    if(resp)
                      this.templates.splice(i,1);
                    else
                      this._uiService.alertaError('No se puede eliminar template')
                  }).catch(err=>{
                      this._uiService.alertaError(err);
                  })
    }
  }
