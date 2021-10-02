import { Router } from "express";
import { contactMiddleware, isAdmin } from "../Lib/middleware";
import { ContactServiceProvider } from "../service/Contact.service";

const contactsRoutes = Router();
const contactsService = new ContactServiceProvider();

contactsRoutes.get("/", async (req: any, res, next) => {
  try {
    const contacts = await contactsService.fetchContact.fetch(req.universityId);
    res.status(contacts?.status as number).json({
      contacts: contacts!.getResult().payload,
      message: contacts!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contactsRoutes.post("/", contactMiddleware, async (req: any, res, next) => {
  try {
    const contacts = await contactsService.addContact.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      Campuses_id: req.body.campus_id,
      University_id: req.universityId,
    });
    res.status(contacts?.status as number).json({
      contacts: contacts!.getResult().payload,
      message: contacts!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});
contactsRoutes.put("/", contactMiddleware, async (req: any, res, next) => {
  try {
    const contacts = await contactsService.editContact.mod({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      Campuses_id: req.body.campus_id,
      University_id: req.universityId,
    });
    res.status(contacts?.status as number).json({
      contacts: contacts!.getResult().payload,
      message: contacts!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

contactsRoutes.delete("/:id",isAdmin, async (req: any, res, next) => {
  try {
    const contacts = await contactsService.deleteContact.remove(req.params.id);
    res.status(contacts?.status as number).json({
      contacts: contacts!.getResult().payload,
      message: contacts!.getResult().message,
    });
  } catch (error) {
    next(error);
  }
});

export default contactsRoutes;
