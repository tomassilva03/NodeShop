------------------------------------------------
----------------  SCHEMA  ----------------------
------------------------------------------------

DROP SCHEMA IF EXISTS nodeshop CASCADE;

CREATE SCHEMA IF NOT EXISTS nodeshop;

SET search_path TO nodeshop;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

------------------------------------------------
----------------  DROPS  -----------------------
------------------------------------------------

---------------- TABLES  -----------------------
DROP TABLE IF EXISTS user_address;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS user_payment_method;
DROP TABLE IF EXISTS product_category;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS product_item;
DROP TABLE IF EXISTS variation;
DROP TABLE IF EXISTS variation_option;
DROP TABLE IF EXISTS product_configuration;
DROP TABLE IF EXISTS promotion_category;
DROP TABLE IF EXISTS promotion;
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS shopping_cart_item;
DROP TABLE IF EXISTS shop_order;
DROP TABLE IF EXISTS shipping_method;
DROP TABLE IF EXISTS order_status;
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS user_review;
DROP TABLE IF EXISTS shop;
DROP TABLE IF EXISTS user_audit;
DROP TABLE IF EXISTS app_user;

---------------- TYPES  ------------------------
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS payment_type;
DROP TYPE IF EXISTS provider;

---------------- INDEXES  ----------------------
DROP INDEX IF EXISTS idx_address_country_id;
DROP INDEX IF EXISTS idx_user_address_user_id;
DROP INDEX IF EXISTS idx_user_address_address_id;
DROP INDEX IF EXISTS idx_product_category_parent_category_id;
DROP INDEX IF EXISTS idx_promotion_category_category_id;
DROP INDEX IF EXISTS idx_promotion_category_promotion_id;
DROP INDEX IF EXISTS idx_product_category_id;
DROP INDEX IF EXISTS idx_product_shop_id;
DROP INDEX IF EXISTS idx_product_item_product_id;
DROP INDEX IF EXISTS idx_variation_product_id;
DROP INDEX IF EXISTS idx_variation_option_variation_id;
DROP INDEX IF EXISTS idx_product_configuration_product_item_id;
DROP INDEX IF EXISTS idx_product_configuration_variation_option_id;
DROP INDEX IF EXISTS idx_user_payment_method_user_id;
DROP INDEX IF EXISTS idx_shopping_cart_user_id;
DROP INDEX IF EXISTS idx_shopping_cart_item_shopping_cart_id;
DROP INDEX IF EXISTS idx_shopping_cart_item_product_item_id;
DROP INDEX IF EXISTS idx_shop_order_user_id;
DROP INDEX IF EXISTS idx_shop_order_payment_method;
DROP INDEX IF EXISTS idx_shop_order_shipping_address;
DROP INDEX IF EXISTS idx_shop_order_shipping_method_id;
DROP INDEX IF EXISTS idx_shop_order_order_status_id;
DROP INDEX IF EXISTS idx_order_item_order_id;
DROP INDEX IF EXISTS idx_order_item_product_item_id;
DROP INDEX IF EXISTS idx_user_review_user_id;
DROP INDEX IF EXISTS idx_user_review_ordered_product_id;

---------------- FTS INDEXES  ------------------
DROP INDEX IF EXISTS idx_product_fts;
DROP INDEX IF EXISTS idx_shop_fts;

---------------- TRIGGERS  ---------------------
DROP TRIGGER IF EXISTS user_audit_update ON app_user;
DROP TRIGGER IF EXISTS user_audit_delete ON app_user;
DROP TRIGGER IF EXISTS user_audit_insert ON app_user;


------------------------------------------------
----------------  TYPES  -----------------------
------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'buyer',
    'seller',
    'admin'
);

CREATE TYPE payment_type AS ENUM (
    'credit_card',
    'paypal',
    'stripe'
);

CREATE TYPE provider AS ENUM (
    'visa',
    'mastercard',
    'american_express',
    'paypal',
    'stripe'
);

------------------------------------------------
----------------  TABLES  ----------------------
------------------------------------------------

CREATE TABLE country (
    id SERIAL PRIMARY KEY,
    country_name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL
);

CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    zip_code VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    country_id INTEGER NOT NULL REFERENCES country(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    role user_role NOT NULL DEFAULT 'buyer',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE user_address (
    user_id UUID NOT NULL REFERENCES app_user(id),
    address_id INTEGER NOT NULL REFERENCES address(id),
    PRIMARY KEY (user_id, address_id)
);

CREATE TABLE product_category (
    id SERIAL PRIMARY KEY,
    parent_category_id INTEGER REFERENCES product_category(id),
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE promotion (
    id SERIAL PRIMARY KEY,
    promotion_name VARCHAR(255) NOT NULL,
    promotion_description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount DECIMAL(10,2) NOT NULL
);

CREATE TABLE promotion_category (
    category_id INTEGER NOT NULL REFERENCES product_category(id),
    promotion_id INTEGER NOT NULL REFERENCES promotion(id),
    PRIMARY KEY (category_id, promotion_id)
);

CREATE TABLE shop (
    id SERIAL PRIMARY KEY,
    shop_name VARCHAR(255) NOT NULL,
    shop_description TEXT NOT NULL,
    shop_image VARCHAR(255) NOT NULL,
    shop_owner_id UUID NOT NULL REFERENCES app_user(id)
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES product_category(id),
    shop_id INTEGER NOT NULL REFERENCES shop(id),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    product_image VARCHAR(255) NOT NULL
);

CREATE TABLE product_item (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id),
    sku VARCHAR(255) NOT NULL,
    qty_in_stock INTEGER NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE variation (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id),
    variation_type VARCHAR(255) NOT NULL
);

CREATE TABLE variation_option (
    id SERIAL PRIMARY KEY,
    variation_id INTEGER NOT NULL REFERENCES variation(id),
    option_value VARCHAR(255) NOT NULL
);

CREATE TABLE product_configuration (
    product_item_id INTEGER NOT NULL REFERENCES product_item(id),
    variation_option_id INTEGER NOT NULL REFERENCES variation_option(id),
    PRIMARY KEY (product_item_id, variation_option_id)
);

CREATE TABLE user_payment_method (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    payment_type payment_type NOT NULL,
    provider provider NOT NULL,
    last_four_digits VARCHAR(255) NOT NULL,
    expiration_month DATE NOT NULL,
    expiration_year DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE shopping_cart (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id)
);

CREATE TABLE shopping_cart_item (
    id SERIAL PRIMARY KEY,
    shopping_cart_id INTEGER NOT NULL REFERENCES shopping_cart(id),
    product_item_id INTEGER NOT NULL REFERENCES product_item(id),
    qty INTEGER NOT NULL
);

CREATE TABLE shipping_method (
    id SERIAL PRIMARY KEY,
    shipping_method_name VARCHAR(255) NOT NULL,
    shipping_method_description TEXT NOT NULL,
    shipping_method_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE order_status (
    id SERIAL PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL
);

CREATE TABLE shop_order (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    order_date DATE NOT NULL,
    payment_method INTEGER NOT NULL REFERENCES user_payment_method(id),
    shipping_address INTEGER NOT NULL REFERENCES address(id),
    shipping_method_id INTEGER NOT NULL REFERENCES shipping_method(id),
    order_total DECIMAL(10,2) NOT NULL,
    order_status_id INTEGER NOT NULL REFERENCES order_status(id)
);

CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES shop_order(id),
    product_item_id INTEGER NOT NULL REFERENCES product_item(id),
    qty INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE TABLE user_review (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    ordered_product_id INTEGER NOT NULL REFERENCES order_item(id),
    rating_value INTEGER NOT NULL,
    comment TEXT NOT NULL
);

CREATE TABLE user_audit (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES app_user(id),
    action VARCHAR(10) NOT NULL,
    action_timestamp TIMESTAMP NOT NULL
);

------------------------------------------------
----------------  INDEXES  ---------------------
------------------------------------------------

-- Indexes for foreign keys
CREATE INDEX idx_address_country_id ON address(country_id);
CREATE INDEX idx_user_address_user_id ON user_address(user_id);
CREATE INDEX idx_user_address_address_id ON user_address(address_id);
CREATE INDEX idx_product_category_parent_category_id ON product_category(parent_category_id);
CREATE INDEX idx_promotion_category_category_id ON promotion_category(category_id);
CREATE INDEX idx_promotion_category_promotion_id ON promotion_category(promotion_id);
CREATE INDEX idx_product_category_id ON product(category_id);
CREATE INDEX idx_product_shop_id ON product(shop_id);
CREATE INDEX idx_product_item_product_id ON product_item(product_id);
CREATE INDEX idx_variation_product_id ON variation(product_id);
CREATE INDEX idx_variation_option_variation_id ON variation_option(variation_id);
CREATE INDEX idx_product_configuration_product_item_id ON product_configuration(product_item_id);
CREATE INDEX idx_product_configuration_variation_option_id ON product_configuration(variation_option_id);
CREATE INDEX idx_user_payment_method_user_id ON user_payment_method(user_id);
CREATE INDEX idx_shopping_cart_user_id ON shopping_cart(user_id);
CREATE INDEX idx_shopping_cart_item_shopping_cart_id ON shopping_cart_item(shopping_cart_id);
CREATE INDEX idx_shopping_cart_item_product_item_id ON shopping_cart_item(product_item_id);
CREATE INDEX idx_shop_order_user_id ON shop_order(user_id);
CREATE INDEX idx_shop_order_payment_method ON shop_order(payment_method);
CREATE INDEX idx_shop_order_shipping_address ON shop_order(shipping_address);
CREATE INDEX idx_shop_order_shipping_method_id ON shop_order(shipping_method_id);
CREATE INDEX idx_shop_order_order_status_id ON shop_order(order_status_id);
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_product_item_id ON order_item(product_item_id);
CREATE INDEX idx_user_review_user_id ON user_review(user_id);
CREATE INDEX idx_user_review_ordered_product_id ON user_review(ordered_product_id);

------------------------------------------------
----------------  FTS INDEXES  -----------------
------------------------------------------------

-- Index for product table
ALTER TABLE product
ADD COLUMN tsvector_column TSVECTOR;

-- Function to update ts_vectors for product table
CREATE OR REPLACE FUNCTION product_search_update() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_column = (
        setweight(to_tsvector('english', NEW.name), 'A') ||
        setweight(to_tsvector('english', NEW.description), 'B')
    );
    RETURN NEW;
END $$ LANGUAGE plpgsql;

-- Trigger for product table
CREATE TRIGGER product_search_update 
BEFORE INSERT OR UPDATE ON product
FOR EACH ROW
EXECUTE PROCEDURE product_search_update();

-- GIN index for product table 
CREATE INDEX idx_product_fts ON product USING GIN (tsvector_column);

-- Index for shop table
ALTER TABLE shop
ADD COLUMN tsvector_column TSVECTOR;

-- Function to update ts_vectors for shop table
CREATE OR REPLACE FUNCTION shop_search_update() RETURNS TRIGGER AS $$
BEGIN
    NEW.tsvector_column = (
        setweight(to_tsvector('english', NEW.shop_name), 'A') ||
        setweight(to_tsvector('english', NEW.shop_description), 'B')
    );
    RETURN NEW;
END $$ LANGUAGE plpgsql;

-- Trigger for shop table
CREATE TRIGGER shop_search_update 
BEFORE INSERT OR UPDATE ON shop
FOR EACH ROW
EXECUTE PROCEDURE shop_search_update();

-- GIN index for shop table 
CREATE INDEX idx_shop_fts ON shop USING GIN (tsvector_column);

------------------------------------------------
----------------  TRIGGERS  --------------------
------------------------------------------------

-- Function to insert into user_audit table everytime a user is updated
CREATE OR REPLACE FUNCTION user_audit_update_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO nodeshop.user_audit (user_id, action, action_timestamp)
        VALUES (NEW.id, 'update', NOW());
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

-- Create the user_audit_update trigger
CREATE TRIGGER user_audit_update
AFTER UPDATE ON app_user
FOR EACH ROW
EXECUTE FUNCTION user_audit_update_trigger();

-- Function to insert into user_audit table everytime a user is deleted
CREATE OR REPLACE FUNCTION user_audit_delete_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO nodeshop.user_audit (user_id, action, action_timestamp)
        VALUES (OLD.id, 'delete', NOW());
    END IF;
    RETURN OLD;
END $$ LANGUAGE plpgsql;

-- Create the user_audit_delete trigger
CREATE TRIGGER user_audit_delete
AFTER DELETE ON app_user
FOR EACH ROW
EXECUTE FUNCTION user_audit_delete_trigger();

-- Function to insert into user_audit table everytime a user is inserted
CREATE OR REPLACE FUNCTION user_audit_insert_trigger() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO nodeshop.user_audit (user_id, action, action_timestamp)
        VALUES (NEW.id, 'insert', NOW());
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

-- Create the user_audit_insert trigger
CREATE TRIGGER user_audit_insert
AFTER INSERT ON app_user
FOR EACH ROW
EXECUTE FUNCTION user_audit_insert_trigger();



------------------------------------------------
----------------  INSERTS  ---------------------
------------------------------------------------

