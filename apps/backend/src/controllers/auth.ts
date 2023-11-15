import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { generateId } from "../utils/generate-code";
import { generateEmailBodyNewUser } from "../utils/generateBodyEmail-newUser";
import { sendEmail } from "../utils/mail";
import { SuccessMsg } from "../shared/msg-error";

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  var errors = [];
  const { Username, Email, Password, FirstName, LastName } = req.body;

  if (!Username) {
    errors.push("Username is missing");
  }
  if (!Email) {
    errors.push("Email is missing");
  }
  if (errors.length) {
    res.status(400).json({ error: errors.join(",") });
    return;
  }

  const user = await prisma.user.findMany({
    where: {
		OR: [
			{
				email: Email,
			},
			{
				username: Username
			}
		]
    },
  });

  if (user.length > 0) {
    res.status(400).send("User already exists. Please login");
    return;
  }

  var salt = bcrypt.genSaltSync(10);
  const confirmID: string = generateId();
  const newUser = await prisma.user.create({
    data: {
      username: Username,
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      password: bcrypt.hashSync(Password, salt),
      salt: salt,
	  email_confirm_id: confirmID,
    },
  });

	// const emailBody: string = generateEmailBodyNewUser(Username, confirmID);
	// sendEmail('Verify your account', Email, emailBody);

  res.status(201).send({ msg: "Success" });
}

export async function login(req: Request, res: Response) {
  const { Email, Password } = req.body;
  // Make sure there is an Email and Password in the request
  if (!(Email && Password)) {
    res.status(400).send("All input is required");
    return;
  }

  const user = await prisma.user.findMany({
    where: {
      email: Email,
    },
  });

  if (user.length === 0) {
    res.status(400).send({ error: "User does not exist. Please register" });
    return;
  }

  // * CHECK IF PASSWORD IS CORRECT
  const PHash = bcrypt.hashSync(Password, user[0].salt);
  if (PHash === user[0].password) {
    // * CREATE JWT TOKEN
    const token = jwt.sign(
      { user_id: user[0].id, username: user[0].username, Email },
      process.env.TOKEN_KEY || "",
      {
        expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
      }
    );

    user[0].token = token;
    res.status(200).send({ user: user[0] });
    return;
  } else {
    res.status(400).send({ msg: "No Match" });
    return;
  }
}

export async function ConfirmEmail(req: Request, res: Response) {
    const confirmID = req.params.confirmId;
    // console.log('confirm');
    //recuperer USER
	try {
		console.log('confirm='+confirmID)
		const users = await prisma.user.findMany({
			where: {
				email_confirm_id: confirmID
			}
		})
		if (users.length == 0)
			return res.status(400).json('unknown link');
		if (users.length > 1)
			return res.status(500).json('Link error (dup) - contact admin');
		const user = users[0]
		if (user.email_verified === true)
			return res.status(400).json('link already validated');
		console.log('found')
		console.log(user)
		const retour = await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email_verified: true
			}
		})

	}
	catch (error) {
		return res.status(400).json('unknown link');
	}
	
    // console.log(user);

    // if (!user || user.length !== 1)
    //     return res.status(200).json({ message: 'unknown link' });
    // if (user[0].email_verified === true)
    //     return res.status(200).json({ message: 'already validated' });

    // db.AmendOneElemFromTable(
    //     TableUsersName,
    //     'email_verified',
    //     'id',
    //     user[0].id,
    //     true,
    // );

    return res.status(200).json({ msg: SuccessMsg });
}