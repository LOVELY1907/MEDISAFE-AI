require("dotenv").config();
const sequelize = require("./db");

(async () => {
  try {
    await sequelize.query(`
      ALTER TABLE "Tablets"
      ADD COLUMN IF NOT EXISTS "UserId" INTEGER;
    `);

    await sequelize.query(`
      ALTER TABLE "Tablets"
      ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;
    `);

    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Tablets_UserId_fkey'
        ) THEN
          ALTER TABLE "Tablets"
          ADD CONSTRAINT "Tablets_UserId_fkey"
          FOREIGN KEY ("UserId") REFERENCES "Users"(id)
          ON DELETE CASCADE;
        END IF;
      END$$;
    `);

    console.log("✅ Migration completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
})();
