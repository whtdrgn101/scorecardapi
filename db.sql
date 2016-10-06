CREATE TABLE round_type (
	id INT not null auto_increment
	, name varchar(20)

	, primary key (id)	
);

CREATE TABLE bow_type (
	id INT not null auto_increment
	, name varchar(20)

	, primary key (id)
);

CREATE TABLE member (
	id INT not null auto_increment
	,email VARCHAR(255) NOT NULL
	,name VARCHAR(255) NULL
	,profile_pic BLOB NULL
	,active BOOLEAN NOT NULL DEFAULT true
	,password VARCHAR(255) NOT NULL
	, primary key (id)
);

CREATE TABLE role (
	id INT not null auto_increment
	,name VARCHAR(30) NOT NULL
	, primary key (id)
);

CREATE TABLE member_roles (
	member_id INT NOT NULL
	,role_id INT NOT NULL
	, UNIQUE KEY IX_MEMBER_ROLES (member_id, role_id)
	, FOREIGN KEY (member_id) references member(id) ON DELETE CASCADE
	, FOREIGN KEY (role_id) references role(id) ON DELETE CASCADE	
);

CREATE TABLE bow (
	id INT not null auto_increment
	, member_id INT NOT NULL
	, name varchar(20) NOT NULL
	, bow_type INT NULL
	, make VARCHAR(30)
	, model VARCHAR(30)
	, poundage float
	, brace_height float
	, amo_length float
	, PRIMARY KEY (id)
	, FOREIGN KEY (member_id) references member(id) ON DELETE CASCADE
	, FOREIGN KEY (bow_type) references bow_type(id) ON DELETE set null
);

CREATE TABLE round (
	id INT not null auto_increment
	, member_id INT NOT NULL
	, bow_id INT NULL
	, round_date DATETIME NOT NULL
	, round_type INT NULL
	, total_score INT NULL
	, PRIMARY KEY (id)
	, FOREIGN KEY (member_id) references member(id) ON DELETE CASCADE
	, FOREIGN KEY (bow_id) references bow(id) ON DELETE SET NULL
	, FOREIGN KEY (round_type) references round_type(id) ON DELETE SET NULL
);

CREATE TABLE end (
	id INT not null auto_increment
	, round_id INT NOT NULL
	, end_number INT NOT NULL DEFAULT 1
	, arrow_count INT NOT NULL DEFAULT 1
	, end_score INT NOT NULL DEFAULT 0
	, PRIMARY KEY (id)
	, FOREIGN KEY (round_id) references round(id) ON DELETE CASCADE
);