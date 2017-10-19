import { Schema } from "mongoose";

export var userSchema: Schema = new Schema({
    titleId: String,//"백 투 더 엄마 9화",
    title: String,//"백 투 더 엄마",
    ep: String,//"9화",
    url: String,//"http://minitoon.net/bbs/board.php?bo_table=9999&wr_id=20181&page=1",
    date: String//"10-15"
});
// userSchema.pre("save", function (next) {
//     if (!this.createdAt) {
//         this.createdAt = new Date();
//     }
//     next();
// });