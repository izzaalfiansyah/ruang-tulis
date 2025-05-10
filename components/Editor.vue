<script lang="ts" setup>
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, FloatingMenu, useEditor } from "@tiptap/vue-3";
import {
  ArrowTurnDownLeftIcon,
  ArrowTurnDownRightIcon,
  BoldIcon,
  CodeBracketIcon,
  FlagIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
  PaintBrushIcon,
  UnderlineIcon,
  WindowIcon,
} from "@heroicons/vue/24/outline";
import {
  PaintBrushIcon as PaintBrushIconSolid,
  FlagIcon as FlagIconSolid,
} from "@heroicons/vue/24/solid";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";

const props = defineProps<{
  modelValue: any;
  editable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({ placeholder: "Ketikkan sesuatu..." }),
    Color,
    TextStyle,
    Highlight.configure({
      multicolor: true,
    }),
  ],
  content: props.modelValue,
  editable: props.editable ?? true,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit("update:modelValue", html);
  },
});

const colors: {
  color?: string;
  name: string;
}[] = [
  { color: undefined, name: "Default" },
  { color: "#ff0000", name: "Merah" },
  { color: "#ff7f00", name: "Oranye" },
  { color: "#ffff00", name: "Kuning" },
  { color: "#00ff00", name: "Hijau" },
  { color: "#0000ff", name: "Biru" },
  { color: "#4b0082", name: "Ungu" },
  { color: "#ee82ee", name: "Pink" },
];
</script>

<template>
  <tempate v-if="editor && editable">
    <div class="flex items-center justify-end mb-5">
      <div class="inline-flex items-center space-x-2">
        <EditorToggleButton
          :icon="ArrowTurnDownLeftIcon"
          @click="editor.chain().focus().undo().run()"
          class="px-3"
          :is-disabled="!editor.can().undo()"
        >
          <div class="ml-2">Undo</div>
        </EditorToggleButton>
        <EditorToggleButton
          :icon="ArrowTurnDownRightIcon"
          @click="editor.chain().focus().redo().run()"
          class="px-3"
          :is-disabled="!editor.can().redo()"
        >
          <div class="ml-2">Redo</div></EditorToggleButton
        >
      </div>
    </div>
    <FloatingMenu
      :tippy-options="{
        duration: 100,
        followCursor: true,
      }"
      :should-show="
        ({ editor }) => editor.state.selection.from != editor.state.selection.to
      "
      :editor="editor"
      class="-translate-y-[55%] -translate-x-20"
    >
      <div
        class="mb-5 space-x-2 inline-flex flex-wrap dark:bg-gray-800 bg-gray-100 px-3 py-2 rounded shadow"
        v-if="props.editable"
      >
        <EditorToggleButton
          :icon="BoldIcon"
          :is-active="editor.isActive('bold')"
          @click="editor.chain().focus().toggleBold().run()"
        />
        <EditorToggleButton
          :icon="ItalicIcon"
          :is-active="editor.isActive('italic')"
          @click="editor.chain().focus().toggleItalic().run()"
        />
        <EditorToggleButton
          :icon="UnderlineIcon"
          :is-active="editor.isActive('underline')"
          @click="editor.chain().focus().toggleUnderline().run()"
        />
        <EditorToggleButton :icon="PaintBrushIcon" class="relative w-8 group">
          <div
            class="absolute p-2 bg-gray-100 dark:bg-gray-800 rounded shadow -bottom-1 left-0 transform translate-y-full scale-0 origin-top-left group-hover:scale-100 transition whitespace-nowrap space-y-1"
          >
            <div class="flex flex-col space-y-2">
              <template v-for="color in colors">
                <button
                  class="inline-flex items-center justify-start px-2 py-0.5 rounded"
                  :style="{
                    color: color.color,
                  }"
                  :class="{
                    'bg-primary/25': editor.isActive('textStyle', {
                      color: color.color,
                    }),
                  }"
                  @click="
                    color.color
                      ? editor.chain().focus().setColor(color.color).run()
                      : editor.chain().focus().unsetColor().run()
                  "
                >
                  <PaintBrushIconSolid
                    class="size-4 mr-2"
                    :style="{ color: color.color, fill: color.color }"
                  />
                  {{ color.name }}
                </button>
              </template>
            </div>
          </div>
        </EditorToggleButton>
        <EditorToggleButton :icon="FlagIcon" class="relative w-8 group">
          <div
            class="absolute p-2 bg-gray-100 dark:bg-gray-800 rounded shadow -bottom-1 left-0 transform translate-y-full scale-0 origin-top-left group-hover:scale-100 transition whitespace-nowrap space-y-1"
          >
            <div class="flex flex-col space-y-2">
              <template v-for="color in colors">
                <button
                  class="inline-flex items-center justify-start px-2 py-0.5 rounded"
                  :style="{
                    color: color.color,
                  }"
                  :class="{
                    'bg-primary/25': editor.isActive('highlight', {
                      color: color.color,
                    }),
                  }"
                  @click="
                    color.color
                      ? editor
                          .chain()
                          .focus()
                          .setHighlight({ color: color.color })
                          .run()
                      : editor.chain().focus().unsetHighlight().run()
                  "
                >
                  <FlagIconSolid
                    class="size-4 mr-2"
                    :style="{ color: color.color, fill: color.color }"
                  />
                  {{ color.name }}
                </button>
              </template>
            </div>
          </div>
        </EditorToggleButton>
      </div>
    </FloatingMenu>
    <FloatingMenu
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      class="-translate-y-[55%]"
    >
      <div
        class="mb-5 space-x-2 inline-flex flex-wrap dark:bg-gray-800 bg-gray-100 px-3 py-2 rounded shadow"
        v-if="props.editable"
      >
        <EditorToggleButton
          :icon="H1Icon"
          :is-active="editor.isActive('heading', { level: 1 })"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        />
        <EditorToggleButton
          :icon="H2Icon"
          :is-active="editor.isActive('heading', { level: 2 })"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <EditorToggleButton
          :icon="H3Icon"
          :is-active="editor.isActive('heading', { level: 3 })"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
        <EditorToggleButton
          :icon="ListBulletIcon"
          :is-active="editor.isActive('bulletList')"
          @click="editor.chain().focus().toggleBulletList().run()"
        />
        <EditorToggleButton
          :icon="NumberedListIcon"
          :is-active="editor.isActive('orderedList')"
          @click="editor.chain().focus().toggleOrderedList().run()"
        />
        <EditorToggleButton
          :icon="WindowIcon"
          :is-active="editor.isActive('blockquote')"
          @click="editor.chain().focus().toggleBlockquote().run()"
        />
        <EditorToggleButton
          :icon="CodeBracketIcon"
          :is-active="editor.isActive('code')"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        />
      </div>
    </FloatingMenu>
  </tempate>
  <EditorContent :editor="editor"></EditorContent>
</template>
