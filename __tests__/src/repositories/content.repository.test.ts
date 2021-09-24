import Knex from "knex";
import { ContentRepository, IContent } from "@Repositories/content.repository";
import TableNames from "@Rada/src/Lib/constants";
import { IAdminUser } from "@Rada/src/models/AdminUser.model";

describe("Content Repository", () => {
  const repository = new ContentRepository();
  const conn = Knex({
    client: "pg",
    connection: {
      port: process.env.POSTGRES_PORT as unknown as number,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  });
  const testContent: IContent = {
    content: "Test content",
    path: "/",
    Data_types_id: "1",
    Admin_Users_id: "1",
    Sub_Categories_id: "1",
  };

  describe("Content Repository - createContent", () => {
    it("should successfully add new content data", async () => {
      const admin = await conn<IAdminUser>(TableNames.Admin_Users)
        .select("_id")
        .first();
      const sub = await conn(TableNames.Sub_Categories).select("_id").first();
      testContent.Admin_Users_id = admin?._id?.toString() as string;
      testContent.Sub_Categories_id = sub?._id?.toString() as string;
      const result = (await repository.createContent(testContent)) as {
        [key: string]: any;
      };
      testContent._id = result?._id?.toString() as string;
      const content: { [key: string]: any } = testContent;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(content[key])
      );
    });
  });
  let contentId = 0;
  describe("Content Repository - fetchContents ", () => {
    it("should successfully retrive all available content", async () => {
      const result = await repository.fetchContents();
      contentId = parseInt(result[0]._id as string);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("Content Repository - fetchContent ", () => {
    it("should successfully retrive specific requested  content", async () => {
      const result = (await repository.fetchContent(contentId.toString())) as {
        [key: string]: any;
      };
      testContent._id = result?._id?.toString() as string;
      const content: { [key: string]: any } = testContent;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(content[key])
      );
    });
  });
  const testUpdateContent: IContent = {
    content: "Test content updated",
    path: "/updated path",
    Data_types_id: "1",
    Admin_Users_id: testContent.Admin_Users_id,
    Sub_Categories_id: testContent.Sub_Categories_id,
  };
  describe("Content Repository - EditContent", () => {
    it("should update specific content with the passed data", async () => {
      const result = (await repository.EditContent(
        contentId.toString(),
        testUpdateContent
      )) as {
        [key: string]: any;
      };
      testUpdateContent._id = result?._id?.toString() as string;
      const content: { [key: string]: any } = testUpdateContent;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(content[key])
      );
    });
  });

  describe("Content Repository - DeleteContent", () => {
    it("should remove the specified content from the database", async () => {
      const result = (await repository.DeleteContent(contentId.toString())) as {
        [key: string]: any;
      };
      testUpdateContent._id = result?._id?.toString() as string;
      const content: { [key: string]: any } = testUpdateContent;
      Object.keys(result).forEach((key) =>
        expect(result[key]).toEqual(content[key])
      );
    });
  });
});
