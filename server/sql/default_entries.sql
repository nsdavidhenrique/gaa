INSERT INTO Users (name) VALUES ("Admin");
INSERT INTO Users (name) VALUES ("Brenda");
INSERT INTO Users (name) VALUES ("João");
INSERT INTO Users (name) VALUES ("Igor");
INSERT INTO Users (name) VALUES ("Brian");
INSERT INTO Users (name) VALUES ("Bruno");
INSERT INTO Users (name) VALUES ("Vinicius");

INSERT INTO Areas (name) VALUES ("GAN");
INSERT INTO Areas (name) VALUES ("PDV");
INSERT INTO Areas (name) VALUES ("Caixa");
INSERT INTO Areas (name) VALUES ("Pacote");

INSERT INTO TaskStatuses (name) VALUES("Pendente");
INSERT INTO TaskStatuses (name) VALUES("Em Andamento");
INSERT INTO TaskStatuses (name) VALUES("Finalizado");

INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy, statusId) VALUES ("Descrição teste 1", "2025-08-15T14:30-03:00", true, NULL, 3, 3, 1);
INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy, statusId) VALUES ("Descrição teste 2", "2025-08-16T14:30-03:00", false, 1, 1, 2, 2);
INSERT INTO Tasks (description, deadline, urgent, targetId, areaId, createdBy, statusId) VALUES ("Descrição teste 3", "2025-08-17T14:30-03:00", true, 2, 3, 1, 3);
