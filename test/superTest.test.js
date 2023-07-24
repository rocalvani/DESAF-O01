import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;

const requester = supertest("http://localhost:8080/");

describe("Testing UWU APP", () => {
  let cookie;
  let uid;
  let pid;
  let cid;

  /*=============================================
    =                  SESSIONS                 =
    =============================================*/

  describe("Testing sessions with cookies", () => {
    const mockUser = {
      first_name: "Test",
      last_name: "Test",
      email: "test@test.test",
      password: "123test",
      age: 18,
    };

    // ------ TEST 01 ------ //
    it("/api/jwt/signup should successfully register a new user.", async () => {
      const { statusCode, ok, _body } = await requester
        .post("api/jwt/signup")
        .send(mockUser);
      expect(statusCode).is.equal(201);
      expect(_body.message).to.be.equal("user has successfully been created");
    });

    // ------ TEST 02 ------ //
    it("/api/jwt/login should successfully log a user in.", async () => {
      const mockLogIn = {
        email: mockUser.email,
        password: mockUser.password,
      };
      const result = await requester.post("api/jwt/login").send(mockLogIn);

      const cookieResult = result.headers["set-cookie"][0];

      const cookieData = cookieResult.split(";");
      const cookieName = cookieData[0].split("=");
      cookie = {
        name: cookieName[0],
        value: cookieName[1],
      };

      uid = result._body.cart.user;
      cid = result._body.cart._id;

      expect(result.statusCode).is.equal(201);
      expect(result._body.user.email).to.be.equal(mockUser.email);
      expect(result._body.user.name).to.be.equal(mockUser.first_name);
      expect(cookie.name).to.be.ok.and.equal("jwtCookieToken");
      expect(cookie.value).to.be.ok;
    });
  });

  /*=============================================
    =                    USERS                  =
    =============================================*/

  describe("Testing user management", () => {
    // ------ TEST 01 ------ //
    it("/api/users/premium/:uid should upgrade a user to a premium role", async () => {
      let result = await requester.post(`api/users/premium/${uid}`);
      expect(result.statusCode).is.equal(201);
    });

    // ------ TEST 02 ------ //
    it("/api/users/:uid should get a single user.", async () => {
      let result = await requester.get(`api/users/${uid}`);
      expect(result.statusCode).is.equal(201);
      expect(result._body._id).to.be.equal(uid);
    });
  });

  /*=============================================
    =                  PRODUCTS                 =
    =============================================*/

  describe("Testing product management", () => {
    const mockProduct = {
      title: "Test Product 01",
      description: "This is a test product.",
      thumbnail: "img01.png",
      thumbnail2: "img02.png",
      thumbnail3: "img03.png",
      code: "TestCode01",
      stock: 10,
      status: true,
      category: "testCategory",
      tags: [{ tag: "tag01" }],
      owner: uid,
      price: 1255,
    };

    before(async () => {
      const mockLogIn = {
        email: "test@test.test",
        password: "123test",
      };
      const result = await requester.post("api/jwt/login").send(mockLogIn);

      const cookieResult = result.headers["set-cookie"][0];

      const cookieData = cookieResult.split(";");
      const cookieName = cookieData[0].split("=");
      cookie = {
        name: cookieName[0],
        value: cookieName[1],
      };
    });

    // ------ TEST 01 ------ //
    it("/shop/react should get all products.", async () => {
      const { statusCode, ok, _body } = await requester.get("shop/react");
      expect(statusCode).is.equal(201);
      expect(Array.isArray(_body)).to.be.ok;
    });

    // ------ TEST 02 ------ //
    it("/api/products should successfully create a product.", async () => {
      const { statusCode, ok, _body } = await requester
        .post("api/products/")
        .send(mockProduct)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      pid = _body._id;
      expect(statusCode).is.equal(201);
    });

    // ------ TEST 03 ------ //
    it("/api/products/:pid should successfully update a product.", async () => {
      const { statusCode, ok, _body } = await requester
        .put(`api/products/${pid}`)
        .send({ stock: 12 })
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(statusCode).is.equal(201);
    });

      // ------ TEST 04 ------ //
      it("/api/products/:pid should successfully delete a product.", async () => {
        const { statusCode, ok, _body } = await requester
          .delete(`api/products/${pid}`)
          .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(statusCode).is.equal(201);
      });
  });

  /*=============================================
    =                   CARTS                   =
    =============================================*/

  describe("Testing cart management routes.", () => {
    // ------ TEST 01 ------ //
    it("/api/carts/:cid/product/:pid should autofill a specific user's cart.", async () => {
      const { statusCode } = await requester.put(`api/carts/${cid}`);
      expect(statusCode).is.equal(201);
    });

    // ------ TEST 02 ------ //
    it("/checkout/:cid should get a specific user's cart.", async () => {
      const { statusCode, _body } = await requester.get(`checkout/${cid}`);
      expect(statusCode).is.equal(201);
      expect(_body.products).to.be.ok;
      pid = _body.products[1]._id;
    });

    // ------ TEST 03 ------ //
    it("/api/carts/:cid/product/:pid should not add a product to a specific user's cart if the user created it.", async () => {
      const { statusCode } = await requester.post(
        `api/carts/${cid}/product/${pid}`
      );
      expect(statusCode).is.equal(401);
    });

    // ------ TEST 04 ------ //
    it("/api/carts/:cid/product/:pid should add one more of a product to a specific user's cart.", async () => {
      const { statusCode } = await requester.put(
        `api/carts/${cid}/product/${pid}`
      );
      expect(statusCode).is.equal(201);
    });

    // ------ TEST 05 ------ //
    it("/api/carts/:cid/product/:pid should delete a product to a specific user's cart.", async () => {
      const { statusCode } = await requester.delete(
        `api/carts/${cid}/product/${pid}`
      );
      expect(statusCode).is.equal(201);
    });

    // ------ TEST 06 ------ //
    it("/api/carts/:cid/ should empty a specific user's cart.", async () => {
      const { statusCode } = await requester.delete(`api/carts/${cid}`);
      expect(statusCode).is.equal(201);
    });
  });
});
