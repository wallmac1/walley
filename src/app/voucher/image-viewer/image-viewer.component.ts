import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LineFile } from '../interfaces/line-file';
import { Connect } from '../../classes/connect';

@Component({
  selector: 'app-image-viewer',
  standalone: true,
  imports: [
    MatDialogModule
  ],
  templateUrl: './image-viewer.component.html',
  styleUrl: './image-viewer.component.scss'
})
export class ImageViewerComponent {

  urlServerLaraFile = Connect.urlServerLaraFile;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { file: LineFile },
    public dialogRef: MatDialogRef<ImageViewerComponent>) {
      console.log(data)
    }

  closeModal() {
    this.dialogRef.close();
  }

}
