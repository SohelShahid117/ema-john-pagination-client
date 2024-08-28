import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  //   const totalCountProduct = useLoaderData();
  // console.log(totalCountProduct);
  const { count } = useLoaderData();
  console.log(count);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const numberOfPages = Math.ceil(count / itemsPerPage);
  console.log(numberOfPages);

  // let pages = [];
  // for (let i = 0; i < numberOfPages; i++) {
  //   pages.push(i);
  // }
  // console.log(pages);

  const pages = [...Array(numberOfPages).keys()];
  console.log(pages);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find((product) => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };
  const handleChangeItemsperPage = (e) => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setItemsPerPage(val);
    setCurrentPage(0);
  };

  const handeleCurrentPage = (page) => {
    console.log(page);
    setCurrentPage(page);
  };
  const handlePreviousPage = (e) => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = (e) => {
    // if (currentPage < numberOfPages - 1) {
    //   setCurrentPage(currentPage + 1);
    // }
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>Current Page : {currentPage}</p>
        <button onClick={handlePreviousPage}>Prev</button>
        {pages.map((page, i) => (
          <button
            className={currentPage === page && `selected`}
            key={i}
            onClick={() => {
              handeleCurrentPage(page);
            }}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>
        <select value={itemsPerPage} onChange={handleChangeItemsperPage}>
          {/* <option value={10}>10</option> */}
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;

/******Kokon dependency rakbo r kokon dependency rakbona?e.g:uporer useeffect e kono dependency rakinai but nicher useeffect e dependency rekhechi.r dependency rakle seta ki rakte hobe.Plesae give good knowledge about it*******/
/*in useEffect hook when we keep dependency and when not given dependency?*/
/*
1.No Dependency Array: The effect runs after every render. Use this when the effect needs to run on every render (rarely recommended).
useEffect(() => {
  // Code here runs after every render
});

2.Empty Dependency Array []: The effect runs only once, after the initial render. Use this for one-time setup actions.
useEffect(() => {
  // Code here runs only once after the initial render
}, []);

3.With Specific Dependencies [dep1, dep2]: The effect runs after the initial render and whenever any of the specified dependencies change. Use this when your effect depends on certain state or prop values.
useEffect(() => {
  // Code here runs after the initial render
  // and every time dep1 or dep2 changes
}, [dep1, dep2]);
*/

//62-5 (Interesting) Set current page state and next prev button
