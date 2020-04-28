alter table personalities
add foreign key(duality_id) references personalities(personality_id);

alter table personalities
add foreign key(mirage_id) references personalities(personality_id);

alter table personalities
add foreign key(semi_duality_id) references personalities(personality_id);

exit;