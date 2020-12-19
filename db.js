const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify:false,
      useCreateIndex: true
    })
    .then(()=>{
      console.log('connecting to mongo instance');
    })
    .catch(e => {
      console.log(e.message);
    })

    mongoose.connection.on('connected',()=>{
      console.log('connected to mongo instance....');
    })

    mongoose.connection.on('error',(err)=>{
      console.log(err.message);
    })

    mongoose.connection.on('disconnected',()=>{
      console.log('connection is disconnected');
    })

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    })
