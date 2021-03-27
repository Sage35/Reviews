# Reviews Backend Micro-Service

### Scalable REST API connected to Postgres database, Redis cache, and React-Redux front-end application.

![Reviews-Tools](./documentation/readme-logos.png)

*This project consists of a REST API that provides an interface between a Postgres database / Redis cache and a front-end web application. The API provides several endpoints to access, post to, and update the data. The GET endpoints make use of a Redis cache to increase response speed and accuracy when the database is overloaded. This project intends to maximize the efficiency of a single instance of the service prior to implementing horizontal scaling.*

---

## Table of Contents
#### 1. [Install](#Install)
#### 2. [Tech Stack](#Tech-Stack)
#### 3. [Routes](#Routes)
   1. [Get Reviews](#Get-Reviews)
   1. [Get Reviews Meta Data](#Get-Reviews-Meta-Data)
   1. [Post Review](#Post-Review)
   1. [Update Review Helpfulness](#Update-Review-Helpfulness)
   1. [Update Review Report Status](#Update-Review-Report-Status)
#### 4. [Performance](#Performance)
   1. [Basic Route Performance](#Basic-Route-Performance)
   1. [Abnormal Traffic Handling with Redis](#Abnormal-Traffic-Performance)

---

## Install

Run `docker-compose up` and navigate to http://localhost:8000 to see the front-end application.
- The API runs on port 3000, at http://localhost:3000.
- The postgres database runs on port 5432, at http://localhost:5432.
- The redis cache runs on port 6379, at http://localhost:6379.

> *(Note: If running on a local machine, the project will not need any additional configuration. Please see the section below on setting environment variables if deploying in another setting.)*

Set environment variables if running on a different machine. Environment variables can be specified in the repository in each service's folder as a .env file or directly in docker-compose.
- For the front-end (FEC):
   * **SERVER_IP** = The IP address and port number of the server to send HTTP requests to. Defaults to localhost:3000.
- For the API (server):
   * **FEC_IP** = The IP address and port number of the front-end to receive requests from. Defaults to localhost:8000.
   * **STATSD** = The IP address for the StatsD server.
   * **LOADER** = The loader.io verification string.

---

## Tech-Stack

   * [Node.js](https://nodejs.org/en/)
   * [Express](https://expressjs.com)
   * [AWS - EC2](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc)
   * [Docker](https://www.docker.com/)
   * [PostgreSQL](https://www.postgresql.org/)
   * [Redis](https://redis.io/)
   * [StatsD](https://github.com/statsd/statsd)
   * [Loader.io](https://loader.io/)

---

## Routes

---

### Get Reviews

#### Endpoint: `/reviews`

#### **GET**:
This route returns the reviews for a specific product. Server side pagination returns a specific subset of the stored reviews to the user. The user can provide optional query parameters to specify the number of results per page and which page to return. The user can also optionally specify the order in which the reviews appear, by date, helpfulness, or relevance.

**Query Parameters:**

- **product_id** = (Required) The product id of the desired product.
- **count** = (Optional) The number of entries per page. (Default value: 5) <br>
- **page** = (Optional) The page of the results to return. (Default value: 1) <br>
- **sort** = (Optional) The order of the reviews. Options include: "newest", "helpful", and "relevant" (Default value: "relevant") <br>

#### *Example:*  `/reviews/?page=2&count=3&sort=helpful&product_id=17` - will return reviews 4-6 for product #17 sorted by helpfulness.

>If query parameters count, page, and sort are not specified results 1 thru 5 will be returned, sorted by relevance.

---

### Get Reviews Meta Data

#### Endpoint: `/reviews/meta`

#### **GET**:
This route will return the meta data for a product's reviews.

**Query Parameters:**

- **product_id** = The product id of the desired product.

#### *Example:*  `/reviews/meta/?product_id=17` - will return the meta data for the reviews of product #17.

---

### Post Review

#### Endpoint: `/reviews`

#### **POST**:
This route will post a new review based on body parameters specified.

**Query Body Parameters:**

- **product_id** = The product id of the product being reviewed.
- **rating** = An integer indicating the review rating (1-5).
- **summary** = The summary text of the review.
- **body** = The continued or full text of the review.
- **recommend** = A boolean value indicating if the reviewer recommends the product.
- **name** = Reviewer's username.
- **email** = Reviewer's email.
- **photos** = Array of text urls that link to images to be shown alongside the review.
- **characteristics** = Object of keys representing the characteristic_id and values (1-5) representing the review value for the associated characteristic.

#### *Example:*  `/reviews` with the following body would post a review for product #1.
    {
      "product_id": 1,
      "rating": 5,
      "summary": "I loved this product!",
      "recommend": true,
      "body": "I loved this product because it fit perfectly and the colors look great!",
      "name": "firstName_lastName",
      "email": "first.last@gmail.com",
      "photos": ['really_cool_mirror_selfie', 'another_mirror_selfie'],
      "characteristics": {"1": 3, "2": 4, "3": 3, "4": 2}
    }

---

### Update Review Helpfulness

#### Endpoint: `/reviews/:review_id/helpful`

#### **PUT:**
This route will increase the helpfulness of a review by one point.

**Query Parameters:**

- **:review_id** = The review id of the desired review to update.

#### *Example:*  `/reviews/1234/helpful` - will increase the helpfulness of review #1234 by one point.

---

### Update Review Report Status

#### Endpoint: `/reviews/:review_id/report`

#### **PUT:**
This route will report the review, leaving it in the database but removing it from GET request results.

**Query Parameters:**

- **:review_id** = The review id of the desired review to report.

#### *Example:*  `/reviews/1234/report` - will report review #1234, removing it from GET request results (will no longer be displayed to users).

---

## Performance

#### **Overview**:

*For testing purposes, the project was deployed to a t2.micro EC2 instance on AWS. The Server, Front-end, PostgreSQL database, and Redis Cache all ran as networked Docker containers on the instance using the provided docker-compose file. Loader.io was used to stress test the routes and StatsD gathered specific timing metrics. Tests targeted the reviews for the last 20% of products. The database was loaded with dummy data to support 1,000,000 unique products. Each product had a randomized number of reviews.*

- Reviews table: ~ 5,800,000 entries <br>
- Product Characteristics table: ~ 3,300,000 entries <br>
- Reviews Characteristics Ratings table: ~ 19,300,000 entries <br>
- Reviews Photos table:  ~ 2,700,000 entries <br>

---

### Basic-Route-Performance:

*Performance was benchmarked by how many requests/second the API could handle while maintaining an average response time below 1500ms and a success rate of 98% or more. The tests target endpoints that reach reviews for the last 20% of products stored in the database. The enpoints for each request is randomized within the range so as to bypass Redis caching and simulate realistic load scenarios for end-users.*

- #### [**Get Reviews** endpoint - randomized product id: 550 Requests/Second](https://bit.ly/3lURVwe)

- #### [**Get Reviews Meta Data** endpoint - randomized product id: 475 Requests/Second](https://bit.ly/39o4v22)

- #### [**Post Review** endpoint - randomized product id: 750 Requests/Second](https://bit.ly/3lYm79D)

- #### [**Update Review Helpfulness** endpoint - randomized review id: 975 Requests/Second](https://bit.ly/31mun9Y)

- #### [**Update Review Report Status** endpoint - randomized review id: 975 Requests/Second](https://bit.ly/3lXRQaV)

---

### Abnormal-Traffic-Performance:

*A Redis cache was set up on GET endpoints to cache results for 5 seconds. If specific products see an abnormally high amount of traffic, the Redis cache will handle the requests which reduces the load on the database and drastically improves the servers' ability to manage the increased traffic. These tests were configured with 50% of the requests going towards the last 20% of the database and the other 50% going towards 500 products. These 500 products could represent the featured products on an e-retail page.*

- #### [**Get Reviews** endpoint: 900 Requests/Second](https://bit.ly/3fxmlUf)

- #### [**Get Reviews Meta Data** endpoint: 875 Requests/Second](https://bit.ly/39k4lbT)
