## E-R Diagram

Well we only have one table, with one primary key that's unique, and everything else is just non-nullable fields. 

## Schema

Included in the code

```
CREATE TABLE `journalentries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `text` text NOT NULL,
  `events` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

There are no relationships needed for this program. There is only one table.

## Database Tables

Just run the server and it will setup the database with the table etc.

## SQL Queries 

In the code they have been commented above the appropriate function.

## Site Integration

The ORM automatically prevents against SQL injection attacks by escaping all input.

React automatically prevents XSS attacks since we're not dangerously setting the HTML.