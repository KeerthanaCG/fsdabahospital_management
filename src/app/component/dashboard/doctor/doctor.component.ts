import { Dialog } from '@angular/cdk/dialog';
import { Component,OnInit, ViewChild} from '@angular/core';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { AddDoctorComponent } from './add-doctor/add-doctor.component';
import { DataService } from '../../../shared/service/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Doctor } from '../../../shared/model/doctor';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteDoctorComponent } from './delete-doctor/delete-doctor.component';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent implements OnInit{

  doctorsArr: any[]=[];
  displayedColumns: string[] = ['name','mobile', 'email', 'department','gender','action'];
  dataSource!: MatTableDataSource<Doctor>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

constructor(public dialog : MatDialog,
  private dataApi:DataService,
  private _snackBar:MatSnackBar)
{}
ngOnInit(): void {
  this.getAllDoctors();
}
addDoctor()
{
const dialogConfig =new MatDialogConfig();
dialogConfig.disableClose=true;//when we click outside the dialog the dialog should not close
dialogConfig.autoFocus=true;
dialogConfig.data={
  title :'Register doctor',
  buttonName : 'Register'
}
const dialogRef =this.dialog.open(AddDoctorComponent,dialogConfig);

dialogRef.afterClosed().subscribe(data=>
  {
    if(data) {
      this.dataApi.addDoctor(data);
      this.openSnackBar("Registration of doctor is successful.","OK")
    }
  })
}
editDoctor(row:any)
{
  //we will check whether it is equal to null then we dont have to process all these things we just return from here
  if(row.id==null || row.name==null){
    return;
  }
const dialogConfig =new MatDialogConfig();
dialogConfig.disableClose=true;//when we click outside the dialog the dialog should not close
dialogConfig.autoFocus=true;
dialogConfig.data=row;
dialogConfig.data.title="Edit Doctor";
dialogConfig.data.buttonName = "Update";
dialogConfig.data.birthdate="birthdate";

const birthdate = row.birthdate instanceof Date ? row.birthdate : new Date(row.birthdate);
const dialogRef =this.dialog.open(AddDoctorComponent,dialogConfig);

dialogRef.afterClosed().subscribe(data=>
  {
    if(data) {
      this.dataApi.updateDoctor(data);
      this.openSnackBar("Updation of doctor is successful.","OK")
    }
  })
}
deleteDoctor(row:any)
{
const dialogConfig =new MatDialogConfig();
dialogConfig.disableClose=false;//when we click outside the dialog the dialog should not close(true)
dialogConfig.autoFocus=true;
dialogConfig.data={
  title :'Delete doctor',
  doctorName:row.name,
 
}
const dialogRef =this.dialog.open(DeleteDoctorComponent,dialogConfig);

dialogRef.afterClosed().subscribe(data=>
  {
    if(data) {
      this.dataApi.deleteDoctor(row.id);
      this.openSnackBar("Deletion of doctor is successful.","OK")
    }
  })
}
viewDoctor(row:any)
{
window.open('/dashboard/doctor/'+row.id,'_blank');
}
getAllDoctors()
{
this.dataApi.getAllDoctors().subscribe(res =>{
  // we areiteratng it using map
  this.doctorsArr=res.map((e:any)=>{
    const data=e.payload.doc.data();
    data.id=e.payload.doc.id;
    return data;
  })
  //print the data from the doctors array
console.log(this.doctorsArr);
this.dataSource=new MatTableDataSource(this.doctorsArr)
this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;
})

}
openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action);
}



applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}


