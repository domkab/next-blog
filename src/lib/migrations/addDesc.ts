import { connect } from '../mongodb/mongoose';
import Post from '../models/postModel';

(async () => {
  await connect();
  await Post.updateMany(
    { description: { $exists: false } },
    { $set: { description: 'No description provided.' } }
  );
  console.log('Done!');
  process.exit(0);
})();