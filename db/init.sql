CREATE TABLE reviews (
  product INT NOT NULL,
  review_id SERIAL PRIMARY KEY,
  rating INT NOT NULL,
  summary VARCHAR,
  recommend BOOLEAN NOT NULL,
  body VARCHAR,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  reviewer_name VARCHAR NOT NULL,
  email VARCHAR,
  helpfulness INT NOT NULL DEFAULT 0,
  reported BOOLEAN NOT NULL DEFAULT false,
  response VARCHAR
);

CREATE INDEX product_reviews_idx ON reviews (product);

CREATE TABLE photos (
  review_id INT NOT NULL,
  id SERIAL,
  url VARCHAR,
  FOREIGN KEY(review_id)
  REFERENCES reviews(review_id)
);

CREATE INDEX review_idx ON photos (review_id);

CREATE TABLE chars (
  product_id INT NOT NULL,
  name VARCHAR NOT NULL,
  id SERIAL PRIMARY KEY
);

CREATE INDEX product_char_idx ON chars (product_id);

CREATE TABLE char_info (
  char_id INT NOT NULL,
  review_id INT NOT NULL,
  value DECIMAL,
  FOREIGN KEY(char_id)
  REFERENCES chars(id),
  FOREIGN KEY(review_id)
  REFERENCES reviews(review_id)
);

CREATE INDEX char_idx ON char_info (char_id);