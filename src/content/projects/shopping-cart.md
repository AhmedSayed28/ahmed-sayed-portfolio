---
title: Shopping Cart Management System
description: An in-memory Java console application for catalog browsing, cart updates, stock validation, and checkout.
category: Java Console Application
problem: Maintain consistent cart operations while preventing invalid quantities and purchases that exceed available inventory.
approach: Object-oriented domain classes, encapsulated business logic, BigDecimal calculations, validation-first checkout, and unit tests.
decisions:
  - Model products and cart operations with encapsulated domain objects.
  - Use BigDecimal for currency calculations.
  - Validate the entire cart before changing inventory.
edgeCase: A checkout with insufficient stock for one item must be rejected without partially deducting stock from other items during validation.
technologies:
  - Java 21
  - OOP
  - Maven
  - JUnit 5
  - Java Collections
  - BigDecimal
githubUrl: https://github.com/AhmedSayed28/java-shopping-cart-console
specimen: shopping-cart
status: published
featured: true
order: 1
visible: true
---

The application keeps the catalog and cart in memory. A shopper can browse products, add or remove items, change quantities, and check out through a console interface.

The most important rule is validation before mutation: every requested quantity is checked against available stock before any inventory is deducted. This keeps a failed checkout from leaving the inventory half updated.
