import { connectDB } from "../src/config/db.js";
import Address from "../src/models/Address.js";
import User from "../src/models/User.js";

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to DB for migration");

    const addresses = await Address.find({});
    console.log(`Found ${addresses.length} addresses to migrate`);

    for (const a of addresses) {
      const user = await User.findById(a.userId);
      if (!user) {
        console.warn(`User not found for address ${a._id}, skipping`);
        continue;
      }

      // avoid duplicates: check by street+postalCode+type
      const exists = user.addresses.find(
        (ad) =>
          ad.street === a.street &&
          ad.postalCode === a.postalCode &&
          ad.type === a.type,
      );
      if (exists) {
        console.log(`Address already exists for user ${user._id}, skipping`);
        continue;
      }

      const item = {
        type: a.type,
        name: a.name,
        phone: a.phone,
        street: a.street,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        country: a.country || "India",
        isDefault: !!a.isDefault,
        instructions: a.instructions || undefined,
      };

      if (item.isDefault) {
        user.addresses.forEach((ad) => {
          if (ad.type === item.type) ad.isDefault = false;
        });
      }

      user.addresses.push(item);
      await user.save();
      console.log(`Migrated address ${a._id} into user ${user._id}`);
    }

    console.log(
      "Migration complete. You may remove Address collection manually if desired.",
    );
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

run();
