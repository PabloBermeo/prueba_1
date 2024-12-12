export interface ITemplates{
    _id?:string,
    userId:string,
    name:string,
    description?:string,
    createdTime?:Number,
    widgets?:Array<IConfigW>
  }
  export interface IDevice{
    _id?:string,
    name:string,
    dId:string,
    password?:string,
    templateName?:string,
    templateId?:string,
    template?:ITemplates,
    selected?:boolean,
    saverRule?:IRules,
    alarmRules?:any[]
  }
  export interface IRules{
    userId:string;
    dId: string;
    emqxRuleId?:string;
    status?:boolean;
  }
  export interface IConfigW{
    userId:string,
    selectedDevice:IDevice,
    variableFullName:string,
    variable:string,
    variableType:string,//puede ser input o "output"
    variableSendFreq?:number,
    icon:string,
    widget?:string,
    text?:'',
    class:string,
    message?:string,
    unit?:string,
    decimalPlaces?:number,
    chartTimeAgo?:number,
    column:string
  
  }

  export interface IRulesAlarm{
    userId?:string;
    dId?: string;
    deviceName?:string;
    emqxRuleId?:string;
    status?:boolean;
    variableFullName?:string,
    variable?:string;
    value?:number;
    condition?:string;
    triggerTime?:number;
    counter?:number;
    createdTime?:number;
  }

  
export interface INotification{
  _id:string,
  userId: string,
  dId: string,
  deviceName: string,
  payload: any,
  emqxRuleId: string,
  topic: string,
  value: number,
  condition: string,
  variableFullName: string,
  variable: string,
  readed: boolean,
  time: number
}