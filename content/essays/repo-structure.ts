/**
 * Long-form essay attached to the "Repo structure" rung.
 * This is the canonical explainer for why a markdown repo is the substrate
 * that makes everything else on the ladder work. Rendered inline in a
 * <details> block on the rung tile.
 */
export const repoStructureEssay = `# Context Is the Compound Interest of AI

At the start of this year, we made a decision at Slice that sounded reasonable in a meeting and terrifying in practice. We were going to rebuild our entire product for enterprise.

Slice Pay had a working prototype, but over the past couple of years we'd accumulated a lot of knowledge that never made it into the product. How we price customer accounts. How risk tiers affect commission eligibility. How refund flows interact with merchant settlement cycles. All the business logic we'd learned from running the prototype but hadn't formalised. Enterprise clients, airlines specifically, would need all of it. We couldn't bolt it onto what we had. We needed to start fresh and build it right.

The scope was enormous. Map every workflow end to end. Document every business rule, every data entity, every API endpoint. Design the dashboards. Build the specs that production code would be written against.

Two people. Me and one engineer. And for the first month, just me. Caio, my principal engineer, was on paternity leave. So it was one PM with Claude and a blank Notion page.

We didn't have the luxury of a big team or a long timeline. Slice Pay sits inside a larger organisation where Pay Later Travel is the more established, more profitable product. We couldn't justify pulling the whole company onto our rebuild. So we decided to build it AI-native from the start. Not because it was trendy. Because we didn't have another option that would move fast enough.

I want to be honest about what that actually looked like in practice, because it wasn't a clean story of picking up a tool and becoming ten times faster overnight. It was slow, then less slow, then suddenly fast. The compounding is what matters.

## Starting with nothing

In January, I was writing documentation in Notion with Claude open on my desktop. The process was roughly: think through a workflow, write it up, ask Claude to help me refine it, paste things back and forth. It sounds workable. It wasn't.

I'd get halfway through mapping a complex workflow and Claude would compress the conversation. The Notion content was eating up the context window. I'd lose the thread, start a new conversation, and spend twenty minutes re-explaining everything. What Slice Pay is. How merchants work. That we're lay-by, not credit. That last one I must have explained fifty times.

The first workflow I completed, merchant onboarding, took nearly a week. And not because the thinking was hard. The thinking was the valuable part. But the formatting, the back and forth between tools, the constant re-explaining of context that should have been obvious, all of that was eating my time.

## The move that changed everything

Around mid-February, I made what felt like a small decision. I moved everything out of Notion and into a git repository. Markdown files instead of rich text pages. The logic was simple: markdown is readable by humans and by AI. It works for me and Caio, and it works for Claude.

But the real unlock wasn't the file format. It was that a repository is a persistent brain.

Instead of re-explaining "we're lay-by, not credit" in every conversation, that distinction lived in a file. Claude could find it. Instead of pasting context about how settlements work, the settlement workflow was already there for it to read. Every document I wrote made the next conversation smarter, because the AI had more to work with.

This is the thing I keep coming back to: AI is genuinely very smart. But without context, it makes confident assumptions that are wrong for your specific system. It doesn't know your edge cases. It doesn't know that your payment plans have a minimum of 28 days, or that commission eligibility depends on the merchant's risk tier. Once those things are documented and accessible, the AI stops guessing and starts reasoning from evidence.

## Compounding through friction

Here's where the compounding really kicked in. Each time I hit a point where something was slow and repeatable, I turned it into a skill. A skill in Claude Code is basically a saved workflow, a set of instructions the AI can follow without me explaining them every time.

My first skill was a publish-to-Notion workflow. I was spending so much time copying markdown into Notion that I automated it. Then I realised I didn't even need Notion anymore. The repo was the source of truth. So I dropped it.

I was also flipping between Claude on desktop and my code editor constantly, which led me to move to Claude in the terminal. One less window. One less context switch. Faster.

Each of these felt like a small optimisation. But they stacked. Over 39 days, I built 30 custom skills covering the entire documentation pipeline:

- **Research skills** that interview me, search existing docs, and run sub-agents for external research, all before I write a single line
- **Authoring skills** that scaffold new workflows from templates
- **Review skills** that apply multiple stakeholder perspectives to a draft
- **Sync skills** that import meeting notes directly into the repo
- **Validation skills** that check for broken references before anything gets published

My tolerance for slowness kept dropping. Early on, spending an hour formatting a document felt normal. A few weeks in, that same hour felt unbearable because I knew it could take ten minutes. So I'd build another skill. Then the next threshold would drop. It became this cycle where the faster I got, the less patience I had for anything manual, which made me faster again.

And after each piece of work, I'd ask: how could we have done that better? The answer always went back into the system. A better template. A smarter skill. A new validation check. Each execution wasn't just output. It was an investment in the next one.

The velocity numbers across the whole ecosystem tell the story. The docs repo alone had 207 commits in 39 days. But the docs hub also drove work across five companion repositories: three mock dashboards, an e-ticket reconciliation agent, and a customer support agent. Across all of them, over 750 commits. On my first day, 9 commits. By early March, I was hitting 33 in a single day. Not because I was typing faster. Because the system was doing more of the mechanical work, and I was spending my time on the part that actually matters: thinking through the product.

## The persona trick

Somewhere around the first week of March, I started creating personas for the people in our team meetings. Finance, compliance, operations, merchant success. Each persona captures how that person thinks, what they typically push back on, what concerns they raise.

Before I bring a workflow to a real consultation, Claude reviews it through each of those lenses. It flags the gaps, raises the objections, and challenges the assumptions. The result has been kind of wild. In my more recent stakeholder consultations, the response has been essentially no comments. Not because people aren't paying attention, but because the document already addressed their questions before they asked them.

I didn't plan this. I just noticed I was getting the same kinds of feedback in meetings, and I thought, "Why don't I get the AI to simulate that feedback first?" It's the same pattern as everything else. I saw friction. I built a skill. The system got smarter.

## Learning from a developer

When Caio came back from paternity leave, the compounding accelerated again in a way I hadn't predicted. I'd built this whole system solo, but watching how a developer used AI day to day taught me things I wouldn't have figured out on my own. The review skill I use now? That came from him. The pattern of writing open specs that an AI agent can execute against? Also him.

That cross-pollination had a concrete payoff. When I built the customer support agent, it took me half a day. End to end. Research, implementation, deployment. This is the same person who, weeks earlier, was spending a day or two just on front-end designs for mock dashboards. The support agent was objectively more complex, and it took a fraction of the time. That's not just the tooling getting better. That's the compounding of everything: the context in the repo, the skills I'd built, the patterns I'd absorbed from working alongside Caio.

## What 39 days produced

The numbers still surprise me a bit. 207 commits. 513 markdown files. 16 end-to-end workflows mapping the complete payment lifecycle. 108 documented business rules. 26 data entities. 8 event storming sessions. Three companion mock dashboards. Two working proof of concepts, an e-ticket reconciliation agent and a customer support agent.

Plus an MkDocs site with automated validation that checks index coverage, broken links, and navigation consistency before anything deploys.

This isn't a documentation project anymore. It's the brain of the product. When we needed to evaluate SOC 2 vendors last week, the context was already there. When I put together our Q2 strategy presentation, I pulled directly from the docs. The system that started as "let me just write down how merchant onboarding works" is now feeding executive decisions.

## The actual lesson

I think there's a common misconception that using AI for work means you sit down, type a prompt, and something useful comes out. That's the demo version. The real version is that the AI gets useful when it has enough context to stop guessing. And building that context is work. Slow, unglamorous, compounding work.

The first workflow took a week. The twentieth took a few hours. Not because I got better at prompting, but because the system underneath had accumulated enough knowledge to carry most of the load.

What excites me now is that the infrastructure phase is done. All the workflows are mapped. The business rules are documented. The specs exist. The next phase is seeing how well we can actually execute on building production code against all of this. The context layer that took 39 days to build is about to become the foundation for the real thing.

I've since applied this same pattern to every project I work on. My personal site, my side projects, even early-stage ideas. Each one gets a repository. Each repository becomes a brain. Markdown files for the AI, skills for the repetitive parts, meeting notes for the context. It's not complicated. It's just consistent.

If you're a PM or founder sitting on a complex product thinking "I don't have the team to document this properly," I'd push back on that framing. You don't need the team. You need the system. Start with one workflow. Write it badly. Let the AI help you make it better. Then notice what's slow, and fix that. Then notice the next thing, and fix that too.

It compounds. That's the whole point.`;
