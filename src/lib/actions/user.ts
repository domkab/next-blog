import User from '../models/userModel';
import { connect } from '../mongodb/mongoose';

export interface ClerkEmail {
  email_address: string;
}

export const CreateOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  email_addresses: ClerkEmail[],
  username: string
) => {
  try {
    await connect();

    const user = await User.findOneAndUpdate(
      { clerkId: id },
      {
        $set: {
          firstName: first_name,
          lastName: last_name,
          profilePicture: image_url,
          email: email_addresses[0].email_address,
          username
        },
      }, { new: true, upsert: true }
    );

    return user;

  } catch (error) {
    console.log('Error creating or updating user:', error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await connect();
    await User.findOneAndDelete({ clerkId: id });
  } catch (error) {
    console.log('Error deleting user:', error);
  };
};