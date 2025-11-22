import express from "express";
import contactCtrl from "../controllers/contact.controller.js";
const router = express.Router();

router
  .route("/contacts")
  .get(contactCtrl.list)
  .post(contactCtrl.create)
  .delete(contactCtrl.removeAll);

router
  .route("/contacts/:contactId")
  .get(contactCtrl.read)
  .put(contactCtrl.update)
  .delete(contactCtrl.remove);

router.param("contactId", contactCtrl.contactByID);

export default router;