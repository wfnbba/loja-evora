import fs from "node:fs";
import process from "node:process";
import ts from "typescript";

const parseSource = (url) => {
  const sourceText = fs.readFileSync(url, "utf8");
  return ts.createSourceFile(
    url.pathname,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
};

const productsSource = parseSource(new URL("../src/lib/products-data.ts", import.meta.url));
const commentsSource = parseSource(
  new URL("../src/lib/first-page-review-comments.ts", import.meta.url),
);

const textValue = (node) => (ts.isStringLiteralLike(node) ? node.text : undefined);
const propertyName = (node) =>
  ts.isIdentifier(node) || ts.isStringLiteralLike(node) ? node.text : undefined;
const objectProperty = (object, name) =>
  object.properties.find(
    (entry) => ts.isPropertyAssignment(entry) && propertyName(entry.name) === name,
  );

const findVariableInitializer = (sourceFile, variableName) => {
  let initializer;
  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === variableName) {
        initializer = declaration.initializer;
      }
    }
  });
  return initializer;
};

const productsArray = findVariableInitializer(productsSource, "products");
const commentsObject = findVariableInitializer(commentsSource, "FIRST_PAGE_REVIEW_COMMENTS");

if (!productsArray || !ts.isArrayLiteralExpression(productsArray)) {
  throw new Error("Não foi possível localizar o array products.");
}
if (!commentsObject || !ts.isObjectLiteralExpression(commentsObject)) {
  throw new Error("Não foi possível localizar FIRST_PAGE_REVIEW_COMMENTS.");
}

const products = productsArray.elements.flatMap((node) => {
  if (!ts.isObjectLiteralExpression(node)) return [];
  const idEntry = objectProperty(node, "id");
  const nameEntry = objectProperty(node, "name");
  const reviewsEntry = objectProperty(node, "reviews");
  const id = idEntry && textValue(idEntry.initializer);
  const name = nameEntry && textValue(nameEntry.initializer);

  if (
    !id ||
    !name ||
    !reviewsEntry ||
    !ts.isArrayLiteralExpression(reviewsEntry.initializer) ||
    reviewsEntry.initializer.elements.length < 10
  ) {
    throw new Error(`${name ?? id ?? "Produto desconhecido"} não possui 10 avaliações.`);
  }

  return [{ id, name }];
});

const commentsByProduct = new Map();
for (const entry of commentsObject.properties) {
  if (!ts.isPropertyAssignment(entry)) continue;
  const id = propertyName(entry.name);
  if (!id || !ts.isArrayLiteralExpression(entry.initializer)) continue;
  commentsByProduct.set(id, entry.initializer.elements.map(textValue));
}

const normalize = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const failures = [];
const occurrences = new Map();
for (const product of products) {
  const comments = commentsByProduct.get(product.id);
  if (!comments) {
    failures.push(`${product.name}: não possui comentários configurados.`);
    continue;
  }
  if (comments.length !== 10) {
    failures.push(`${product.name}: possui ${comments.length} comentários iniciais, não 10.`);
  }

  comments.forEach((comment, index) => {
    if (!comment || !comment.trim()) {
      failures.push(`${product.name}, posição ${index + 1}: comentário vazio.`);
      return;
    }
    const key = normalize(comment);
    const existing = occurrences.get(key) ?? [];
    existing.push(`${product.name}, posição ${index + 1}`);
    occurrences.set(key, existing);
  });
}

for (const id of commentsByProduct.keys()) {
  if (!products.some((product) => product.id === id)) {
    failures.push(`${id}: comentários configurados para um produto inexistente.`);
  }
}

for (const [comment, locations] of occurrences) {
  if (locations.length > 1) {
    failures.push(`Comentário repetido em ${locations.join("; ")}: "${comment}".`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `${occurrences.size} feedbacks verificados: os 10 primeiros de cada um dos ${products.length} produtos são preenchidos e únicos.`,
  );
}
