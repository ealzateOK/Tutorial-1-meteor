import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.methods({

  'tasks.findAll'(hideCompleted){
    console.log(hideCompleted);
    if(!this.userId){
      throw new Meteor.Error('No autorizado');
    }
    console.log(`Tareas del usuario: ${this.userId}`);
    if(hideCompleted === false){
      console.log('Todas las tareas');
      return TasksCollection
      .find({
        userId: this.userId,
      }, {
        sort: {
          createdAt: -1,
        },
      })
      .fetch();

    }
    else if(hideCompleted === true){
      console.log('Pendientes');
      return TasksCollection
      .find({
        isChecked: false,
        userId: this.userId,
      }, {
        sort: {
          createdAt: -1,
        },
      })
      .fetch();
    }
    
    
  },
  'tasks.insert'(text){
    check(text, String);

    if(!this.userId){
      throw new Meteor.Error('No autorizado');
    }
    
    TasksCollection.insert({
      text,
      createdAt: new Date,
      userId: this.userId,
      isChecked: false
    })
  },

  'tasks.remove'(taskId){
    check(taskId, String);

    if(!this.userId){
      throw new Meteor.Error('No autorizado');
    }

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked){
    check(taskId, String);
    check(isChecked, Boolean);

    if(!this.userId){
      throw new Meteor.Error('No autorizado');
    }

    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});