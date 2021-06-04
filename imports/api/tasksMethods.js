import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.methods({
  'tasks.insert'(text){
    check(text, String);

    if(!this.userId){
      throw new Meteor.Error('No autorizado');
    }
    
    TasksCollection.insert({
      text,
      createdAt: new Date,
      userId: this.userId
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