import { TextEncoder, TextDecoder } from 'node:util';
Object.assign(global, { TextDecoder, TextEncoder });
HTMLDialogElement.prototype.showModal=function(){
  this.open=true;
};
HTMLDialogElement.prototype.close=function(){
  this.open=false;
};