create table if not exists public.deliveries(
	identifier int primary key,
	imported_id int not null,
	tracking_number int not null,
	status json,
	customer json,
	shipping_address json,
	country varchar(150) not null,
	carrier varchar(150) not null,
	service varchar(150) not null,
	label json,
	barcodes varchar(150),
	deadline_at varchar(150),
	created_at varchar(150),
	updated_at varchar(150),
	links json
);

create table if not exists public.companies(
	id SERIAL primary key,
	name varchar(255) not NULL,
	city varchar(255) not NULL,
	email varchar(255) not null,
	number varchar(255) not NULL
);

CREATE table if not EXISTS public.continents( 
	id SERIAL primary KEY, 
	name varchar(25) NOT null,
	anual_adjustment int NOT null
);

CREATE table if not EXISTS public.countries( 
	id SERIAL primary KEY, 
	continent_id int NOT NULL, 
	name varchar(25) NOT null,
	CONSTRAINT fk_continent_id
      FOREIGN KEY(continent_id) 
	  REFERENCES public.continents(id)
);

CREATE TABLE IF NOT EXISTS public.employees( 
	id SERIAL PRIMARY KEY, 
	country_id int NOT null,
	first_name varchar(25) NOT null,
	last_name varchar(25) NOT null,
	salary int NOT null,
	CONSTRAINT fk_country_id
      FOREIGN KEY(country_id) 
	  REFERENCES public.countries(id)
);

do $$
begin
  if not exists (select * from public.continents)
	then
		-- Continentes
		insert into public.continents(name, anual_adjustment) 
		values ('América', 4); 
		
		insert into public.continents(name, anual_adjustment) 
		values ('Europa', 5); 
		
		insert into public.continents(name, anual_adjustment) 
		values ('Asia', 6); 
		
		insert into public.continents(name, anual_adjustment) 
		values ('Oceanía', 6); 
		
		insert into public.continents(name, anual_adjustment) 
		values ('Africa', 5);

	end if;
end;
$$;




do $$
begin
  if not exists (select * from public.countries)
	then
		-- Paises
		insert into public.countries(continent_id, name)  
		values (1, 'Chile'); 
		
		insert into public.countries(continent_id, name) 
		values (1, 'Argentina'); 
		
		insert into public.countries(continent_id, name) 
		values (1, 'Canadá'); 
		
		insert into public.countries(continent_id, name) 
		values (1, 'Colombia'); 
		
		insert into public.countries(continent_id, name) 
		values (2, 'Alemania'); 
		
		insert into public.countries(continent_id, name) 
		values (2, 'Francia'); 
		
		insert into public.countries(continent_id, name) 
		values (2, 'España'); 
		
		insert into public.countries(continent_id, name) 
		values (2, 'Grecia'); 
		
		insert into public.countries(continent_id, name) 
		values (3, 'India'); 
		
		insert into public.countries(continent_id, name) 
		values (3, 'Japón'); 
		
		insert into public.countries(continent_id, name) 
		values (3, 'Corea del Sur'); 
		
		insert into public.countries(continent_id, name) 
		values (4, 'Australia');
		
	end if;
end;
$$;


do $$
begin
  if not exists (select * from public.employees)
	then
		-- Empleados
		insert into public.employees(country_id, first_name, last_name, salary)
		values (1, 'Pedro', 'Rojas', 2000); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (2, 'Luciano', 'Alessandri', 2100); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (3, 'John', 'Carter', 3050); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (4, 'Alejandra', 'Benavides', 2150); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (5, 'Moritz', 'Baring', 6000); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (6, 'Thierry', 'Henry', 5900); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (7, 'Sergio', 'Ramos', 6200); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (8, 'Nikoleta', 'Kyriakopulu', 7000); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (9, 'Aamir', 'Khan', 2000); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (10, 'Takumi', 'Fujiwara', 5000); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (11, 'Heung-min', 'Son', 5100); 
		
		insert into public.employees(country_id, first_name, last_name, salary)
		values (12, 'Peter', 'Johnson', 6100);

	end if;
end;
$$;
