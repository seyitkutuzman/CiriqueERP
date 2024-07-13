export class boUserModel {
    ID: number;
    userCode: string;
    userPass: string;
    department: number;
    createDate: Date;
    modifyDate: Date;
    name: string;
    surname: string;
    constructor(
        id: number,
        userCode: string,
        userPass: string,
        department: number,
        createDate: Date,
        modifyDate: Date,
        name: string,
        surname: string
      ) {
        this.ID = id;
        this.userCode = userCode;
        this.userPass = userPass;
        this.department = department;
        this.createDate = createDate;
        this.modifyDate = modifyDate;
        this.name = name;
        this.surname = surname;
      }
}