import { Component, OnInit } from '@angular/core';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Task-Tracker';
  displayedColumns: string[] = ['id', 'name', 'task', 'deadline'];
  tasks:Array<Task>=[];
  constructor(public taskSer:TaskService) {}
  ngOnInit(): void {
    this.taskSer.loadTaskDetails().subscribe(res => this.tasks=res)
  }

    storeTask(taskRef:any){
      console.log(taskRef);
      this.taskSer.storeTask(taskRef);
    }
}
