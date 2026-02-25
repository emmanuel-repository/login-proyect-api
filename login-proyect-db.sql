create database " login-proyect";

create table users
(
    id            int auto_increment
        primary key,
    full_name     varchar(255)               null,
    email         varchar(255)               null,
    password_hash varchar(255)               null,
    role          enum ('standard', 'admin') null,
    constraint email
        unique (email)
);

create table sessions
(
    id                 int auto_increment
        primary key,
    user_id            int      null,
    start_time         datetime null,
    last_activity_time datetime null,
    constraint sessions_ibfk_1
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

INSERT INTO users (id, full_name, email, password_hash, role) VALUES (2, 'Guadalupe Eden Rodriguez', 'eden.her.98@gmail.com', '$2b$10$GhPtKiKwJZlVlTeeorrxee.iBzM5pk.CoVT8U3O0fUxXIcb41GS6G', 'admin');
