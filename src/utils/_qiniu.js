var qiniu =require("qiniu-js");


const qiniuUpload={
  upload(options){
    var file=options.file||null,
    key=options.key||null,
    token=options.token||null,
    next=options.next||null,
    error=options.error||null,
    success=options.success||null,
    putExtra={
      fname:"",
      params:{},
      mimeType:null
    },
    config={
      useCdnDomain:true,
      region:'z2',
      disableStatisticsReport:false
    },
    subObject={
      next:next,
      error:error,
      complete:success
    },
    observable = qiniu.upload(file, key, token, putExtra, config),
    subscription = observable.subscribe(subObject);
  }
}

export default qiniuUpload;
