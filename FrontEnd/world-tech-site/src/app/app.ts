import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'world-tech-site';
}