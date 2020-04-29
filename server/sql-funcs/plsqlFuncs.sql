create or replace function insert_return_match (user_id users.user_id%type, other_user_id users.user_id%type)
return matches.match_id%type
is
    match_id matches.match_id%type;
begin
    insert into matches (first_user, second_user)
    values (user_id, other_user_id)
    returning match_id into match_id;
    return match_id;
end;
/

create or replace function insert_return_match_for_event (user_id users.user_id%type, other_user_id users.user_id%type, event_id events.event_id%type)
return matches.match_id%type
is
    match_id matches.match_id%type;
begin
    insert into matches (first_user, second_user, event_id)
    values (user_id, other_user_id, event_id)
    returning match_id into match_id;
    return match_id;
end;
/

create or replace function insert_return_block (user_id users.user_id%type, other_user_id users.user_id%type)
return blocks.block_id%type
is
    block_id blocks.block_id%type;
begin
    insert into blocks (blocker_id, blockee_id)
    values (user_id, other_user_id)
    returning block_id into block_id;
    return block_id;
end;
/

exit;