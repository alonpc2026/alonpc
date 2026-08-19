const mongoose = require("mongoose");

const facebookGroupLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true, collection: "facebook_group_links" }
);

module.exports =
  mongoose.models.FacebookGroupLink ||
  mongoose.model("FacebookGroupLink", facebookGroupLinkSchema);
