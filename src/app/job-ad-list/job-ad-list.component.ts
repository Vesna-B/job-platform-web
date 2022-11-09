import { Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { JobAdService } from '../job-ad.service';

@Component({
  selector: 'app-job-ad-list',
  templateUrl: './job-ad-list.component.html',
  styleUrls: ['./job-ad-list.component.scss']
})
export class JobAdListComponent implements OnInit {

  jobAds: any;

  search = new FormControl('')
  isPublished = new FormControl(null)

  constructor(
    private _jobAdService: JobAdService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activatedRoute.queryParams
      .subscribe(params => {
        if (params['search']) { this.search.setValue(params['search']) }

        if (params['isPublished']) {
          if (params['isPublished'] === 'true') {
            this.isPublished.setValue(true)
          } else if (params['isPublished'] === 'false') {
            this.isPublished.setValue(false)
          } else {
            this.isPublished.setValue(null)
          }
        }

        this.findAllAds();
      })
    

    this.search.valueChanges
      .pipe(
        debounceTime(600),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.redirect()
      })
  }


  redirect() {
    let query: any = {}

    if (this.search.value) { query['search'] = this.search.value }
    if (this.isPublished.value !== null) { query['isPublished'] = this.isPublished.value }

    this._router.navigate(['/ad-list'], { queryParams: query })
  }


  findAllAds() {
    let searchFilter = this.search.value ? this.search.value : '';
    let isPublishedFilter = null;

    if (this.isPublished.value !== null) { isPublishedFilter = this.isPublished.value }

    this._jobAdService.find(searchFilter, isPublishedFilter)
      .subscribe({
        next: (ads) => this.jobAds = ads,
        error: (err) => console.log(err)
      })
  }

  publish(id: string) {
    this._jobAdService.updateStatus(id, true)
      .subscribe({
        next: () => {
          this.jobAds.forEach((element: any, index: number) => {
            if (element._id === id) {
              element.isPublished = true;
            }
          });
        },
        error: (err) => console.log(err)
      })
  }

  delete(id: string) {
    this._jobAdService.delete(id)
      .subscribe({
        next: () => {
          this.jobAds.forEach((element: any, index: number) => {
            if (element._id === id) {
              this.jobAds.splice(index, 1)
            }
          });
        },
        error: (err) => console.log(err)
      });
  }

}
