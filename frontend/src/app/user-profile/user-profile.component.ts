import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails = [];
  camCapture = {url: '',name:''};

  @ViewChild('video') videoElement: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;

  videoWidth = 0;
  videoHeight = 0;
  constraints = {
      video: {
          facingMode: 'environment',
          width: { ideal: 4096 },
          height: { ideal: 2160 }
      }
  };
  showSucessMessage: boolean;
  serverErrorMessages: any;

  constructor(private renderer: Renderer2, private userService: UserService, private router: Router) {}

  ngOnInit() {
      this.startCamera();
      this.userService.getUserProfile().subscribe(
            res => {
              this.userDetails = res['user'];
              this.camCapture.name = res['user'].fullname;
            },
            err => {
              console.log(err);
            }
          );
  }

  startCamera() {
      if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
          navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
          this.capture();
        } else {
          alert('Sorry, camera not available.');
      }
  }

  attachVideo(stream) {
      this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
      this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
          this.videoHeight = this.videoElement.nativeElement.videoHeight;
          this.videoWidth = this.videoElement.nativeElement.videoWidth;
      });
  }


  capture() {
    interval(33000).subscribe((func => {
      this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
      this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
      // this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
      this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
      var picture: any = this.canvas.nativeElement.toDataURL("image/png");
    this.camCapture.url = picture;
    this.saveCapturePic(this.camCapture);
      // tslint:disable-next-line: prefer-const

    }));
  }
  saveCapturePic(image) {
    this.userService.postUserPicture(image).subscribe(
      res => {
        this.showSucessMessage = true;
        setTimeout(() => this.showSucessMessage = false, 4000);
      },
      err => {
        if (err.status === 422) {
          this.serverErrorMessages = err.error.join('<br/>');
        } else {
          this.serverErrorMessages = 'Something went wrong.Please contact admin.';
        }
      }
    );
  }
  handleError(error) {
      console.log('Error: ', error);
  }

  onLogout() {
    this.userService.deleteToken();
    this.router.navigate(['/login']);
  }

}
