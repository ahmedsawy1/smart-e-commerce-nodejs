const request = require("supertest");
let server = require("../../app");
const api = process.env.API;

describe("Get /test", () => {
  it("should return status code 200 ", async () => {
    const res = await request(server).get(`${api}/test`);
    expect(res.statusCode).toBe(200);
  });

  // it("should get the counts", async () => {
  //   const res = await request(server).get(`${api}/users/get/count`);
  //   expect(res.text).toMatch(/usersCount(.*)/);
  // });

  // it("should return a course with given Id", async () => {
  //   const res = await request(server).get(
  //     `${api}/users/609f48d6412cb607e857896d`
  //   );
  //   expect(res.statusCode).toBe(200);
  // });
});
