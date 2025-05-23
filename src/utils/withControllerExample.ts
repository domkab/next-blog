  // const controller = new AbortController();
  // const post: PostType | null = await (async () => {
  //   try {
  //     const { data } = await axios.post(
  //       `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
  //       { slug },
  //       {
  //         headers: { 'Cache-control': 'no-store' },
  //         signal: controller.signal,
  //       }
  //     );

  //     return data.posts[0];
  //   } catch (error: unknown) {
  //     if (axios.isCancel(error)) {
  //       console.log('Request canceled', error.message);
  //     } else {
  //       console.error('Error fetching post:', error);
  //     }

  //     return null;
  //   }
  // })();