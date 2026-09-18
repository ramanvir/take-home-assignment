/*
 * Ad creative review.
 *
 * Simulates reviewing an advertiser's ad creatives using the JSONPlaceholder
 * /posts endpoint, where each post stands in for one creative.
 */

const ENDPOINT = "https://jsonplaceholder.typicode.com/posts";

/**
 * Review status for a creative, derived from its id.
 *
 * Order matters: the "divisible by 3" rule is checked first, so an id that is
 * divisible by both 3 and 2 (6, 12, 18, ...) is rejected rather than approved.
 * That follows the "else if" wording in the brief.
 */
function getStatus(id) {
  if (id % 3 === 0) return "rejected";
  if (id % 2 === 0) return "approved";
  return "pending";
}

/**
 * Map the raw creatives onto a NEW array of { id, title, status } objects.
 * Titles of rejected creatives are uppercased. The input array is not mutated.
 */
function reviewCreatives(creatives) {
  return creatives.map(({ id, title }) => {
    const status = getStatus(id);

    return {
      id,
      title: status === "rejected" ? String(title).toUpperCase() : title,
      status,
    };
  });
}

/**
 * Fetch the creatives.
 *
 * fetch() only rejects on a network-level failure, so an HTTP error such as
 * 404 or 500 still resolves. response.ok has to be checked explicitly, or a
 * failed request quietly turns into an empty/garbage result.
 */
async function fetchCreatives() {
  const response = await fetch(ENDPOINT);

  if (!response.ok) {
    throw new Error(
      `Request failed with ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected response: expected an array of creatives.");
  }

  return data;
}

async function handleReviewClick() {
  const button = document.getElementById("review-ads");
  const status = document.getElementById("status");

  // Disable the button so an impatient double-click cannot fire two requests.
  button.disabled = true;
  status.textContent = "Fetching creatives…";

  try {
    const creatives = await fetchCreatives();
    const reviewed = reviewCreatives(creatives);

    console.log(reviewed);
    console.table(reviewed); // easier to scan than the raw array

    const rejected = reviewed.filter((c) => c.status === "rejected").length;
    status.textContent =
      `Reviewed ${reviewed.length} creatives (${rejected} rejected). ` +
      "Full array printed to the console.";
  } catch (error) {
    // Log the real error for debugging, show a readable message on the page.
    console.error("Could not review creatives:", error);
    status.textContent = `Something went wrong: ${error.message}`;
  } finally {
    button.disabled = false;
  }
}

document
  .getElementById("review-ads")
  .addEventListener("click", handleReviewClick);
