import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { FormStatus, JobAd } from '../job-ad';
import { JobAdService } from '../job-ad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-ad-form',
  templateUrl: './job-ad-form.component.html',
  styleUrls: ['./job-ad-form.component.scss']
})
export class JobAdFormComponent implements OnInit {

  enumFormStatus = FormStatus;
  formStatus = this.enumFormStatus.CREATE;

  id = '';

  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    skills: this.fb.array([]),
  })

  isPublished = false;

  constructor(
    private fb: FormBuilder,
    private _jobAdService: JobAdService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params
      .pipe(map(params => params['id']))
      .subscribe(async id => {
        if (id) {
          this.id = id;
          this._jobAdService.findById(this.id)
            .subscribe({
              next: ad => {

                this.formStatus = this.enumFormStatus.EDIT;
                const jobAd = ad
                const element = {
                  title: jobAd.title,
                  description: jobAd.description
                }
                this.form.patchValue(element)

                for (const skill of jobAd.skills) { this.addSkill(skill) }
              },
              error: (err) => this._router.navigate(['/index'])
            });
        } else {
          this.formStatus = this.enumFormStatus.CREATE;
        }
      })
  }

  get title() { return this.form.get('title'); }
  get description() { return this.form.get('description'); }
  get skills() { return this.form.get('skills') as FormArray; }


  addSkill(skill?: string): void {
    let newSkill = new FormControl('');
    if (skill) { newSkill.setValue(skill) }
    this.skills.push(newSkill);
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }


  submit(isPublished: boolean): void {
    this.form.markAllAsTouched();
    
    if (this.form.invalid) { 
      return; 
    }

    let data = {...this.form.value, isPublished}

    if (this.formStatus === this.enumFormStatus.CREATE) {
      this._jobAdService.create(data)
        .subscribe({
          next: () => {
            this._snackBar.open('You have successfully created a job ad',  '', { duration: 3000 });
            this._router.navigate(['/ad-list'])
          },
          error: (err) => this._snackBar.open('Something went wrong', '', { duration: 3000 })
        })
    } else {
      this._jobAdService.edit(this.id, data)
        .subscribe({
          next: () => {
            this._snackBar.open('You have successfully edited a job ad', '', { duration: 3000 });
            this._router.navigate(['/ad-list'])
          },
          error: (err) => this._snackBar.open('Something went wrong', '', { duration: 3000 })
        })
    }
    
  }

}
