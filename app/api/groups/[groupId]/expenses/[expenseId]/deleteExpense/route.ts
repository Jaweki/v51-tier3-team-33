import dbConnect from "@/lib/dbConnect";
import Expense from "@/models/Expenses";
import Group from "@/models/Group";
import { NextRequest, NextResponse } from "next/server";
import UserExpense from "@/models/UserExpense";
import { deleteFromS3 } from "@/lib/s3Receipts";

export const DELETE = async (request: NextRequest, { params }: { params: { groupId: string; expenseId: string } }) => {
  try {
    await dbConnect();

    const {groupId, expenseId} = params;

    const existingExpense = await Expense.findById(expenseId);

    if (!existingExpense) {
      return NextResponse.json({error: "Expense not found"}, {status: 404});
    }

    if (existingExpense.receipt_url) { // if the expense has an existing receipt image, delete it
      const url = existingExpense.receipt_url;
      const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;
      const fileName = url.replace(baseUrl, "");
      await deleteFromS3(fileName);
    }

    const group = await Group.findByIdAndUpdate(groupId, {
      $pull: {expenses: expenseId}}, {new: true}); //remove the expense id from the array of expenses.
    
    if (!group) {
      return NextResponse.json({error: "Group not found"}, {status: 404});
    }

    if (group?.members && group.members.length > 0) { // delete all user expenses associated with the expense
      for (const memberId of group.members) {
        const userExpense = await UserExpense.findOneAndDelete({
          user_id: memberId,
          expense_id: expenseId,
        })
        
        if (!userExpense) {
          return NextResponse.json({error: "User expense not found", memberId, expenseId}, {status: 404});
        }
        console.log(userExpense);
      }
    }

    const expenseToDelete = await Expense.findByIdAndDelete(expenseId); // lastly delete the expense

    if (!expenseToDelete) {
      return NextResponse.json({message: "Expense not found"}, {status: 404});
    }
  
    return NextResponse.json({message: "Expense succesfully deleted"}, {status: 200});

  } catch(error) {
    return NextResponse.json({error: error})
  }
} 