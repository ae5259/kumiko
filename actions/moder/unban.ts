import { bot } from "../../config/bot.ts";
import { MyContext } from "../../types/context.ts";
import { isAdmin, isReplyingToMe } from "../../utils/detect.ts";

bot.command("unban").filter(
  async (ctx: MyContext) => await isAdmin(ctx),
  async (ctx: MyContext) => {
    const reply_to_message = ctx.message?.reply_to_message;

    if (reply_to_message == undefined) {
      await ctx.reply(ctx.t("reply-to-message"));
      return;
    }

    const replied_user = reply_to_message.from;

    if (replied_user == undefined) {
      return;
    }

    if (isReplyingToMe(ctx)) {
      await ctx.reply(ctx.t("should-i-ban-myself"));
      return;
    }
    await ctx.unbanChatMember(replied_user.id)
      .then(
        () => {
          ctx.reply(
            ctx.t("user-unbanned", {
              user_name: replied_user.first_name,
              user_id: replied_user.id!,
            }),
            {
              parse_mode: "Markdown",
            },
          );
        },
      );
  },
);
